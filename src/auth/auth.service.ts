import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod, User } from '@prisma/__generated__'
import { verify } from 'argon2'
import { Request, Response } from 'express'

import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'
import { ProviderService } from './provider/provider.service'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

/**
 * Сервис для аутентификации и управления сессиями пользователей.
 */
@Injectable()
export class AuthService {
	/**
	 * Конструктор сервиса аутентификации.
	 * @param prismaService - Сервис для работы с базой данных Prisma.
	 * @param userService - Сервис для работы с пользователями.
	 * @param configService - Сервис для работы с конфигурацией приложения.
	 * @param providerService - Сервис для работы с провайдерами аутентификации.
	 * @param emailConfirmationService - Сервис для работы с подтверждением email.
	 * @param twoFactorAuthService - Сервис для работы с двухфакторной аутентификацией.
	 */
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService,
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly twoFactorAuthService: TwoFactorAuthService
	) {}

	/**
	 * Регистрирует нового пользователя.
	 * @param dto - Объект с данными для регистрации пользователя.
	 * @returns Объект с сообщением об успешной регистрации.
	 * @throws ConflictException - Если пользователь с таким email уже существует.
	 */
	public async register(dto: RegisterDto) {
		const isExists = await this.userService.findByEmail(dto.email)

		if (isExists) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.'
			)
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			'',
			AuthMethod.CREDENTIALS,
			false
		)

		await this.emailConfirmationService.sendVerificationToken(newUser.email)

		return {
			message:
				'Вы успешно зарегистрировались. Пожалуйста, подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес.'
		}
	}

	/**
	 * Выполняет вход пользователя в систему.
	 * @param req - Объект запроса Express.
	 * @param dto - Объект с данными для входа пользователя.
	 * @returns Объект с пользователем после успешного входа.
	 * @throws NotFoundException - Если пользователь не найден.
	 * @throws UnauthorizedException - Если пароль неверный или email не подтвержден.
	 */
	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !user.password) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введенные данные'
			)
		}

		const isValidPassword = await verify(user.password, dto.password)

		if (!isValidPassword) {
			throw new UnauthorizedException(
				'Неверный пароль. Пожалуйста, попробуйте еще раз или восстановите пароль, если забыли его.'
			)
		}

		if (!user.isVerified) {
			await this.emailConfirmationService.sendVerificationToken(
				user.email
			)
			throw new UnauthorizedException(
				'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес.'
			)
		}

		if (user.isTwoFactorEnabled) {
			if (!dto.code) {
				await this.twoFactorAuthService.sendTwoFactorToken(user.email)

				return {
					message:
						'Проверьте вашу почту. Требуется код двухфакторной аутентификации.'
				}
			}

			await this.twoFactorAuthService.validateTwoFactorToken(
				user.email,
				dto.code
			)
		}

		return this.saveSession(req, user)
	}

	/**
	 * Извлекает профиль пользователя из кода авторизации провайдера.
	 * @param req - Объект запроса Express.
	 * @param provider - Название провайдера аутентификации.
	 * @param code - Код авторизации провайдера.
	 * @returns Объект с пользователем после успешной аутентификации.
	 */
	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const providerInstance = this.providerService.findByService(provider)
		const profile = await providerInstance.findUserByCode(code)

		const account = await this.prismaService.account.findFirst({
			where: {
				id: profile.id,
				provider: profile.provider
			}
		})

		let user = account?.userId
			? await this.userService.findById(account.userId)
			: null

		if (user) {
			return this.saveSession(req, user)
		}

		user = await this.userService.create(
			profile.email,
			'',
			profile.name,
			profile.picture,
			AuthMethod[profile.provider.toUpperCase()],
			true
		)

		if (!account) {
			await this.prismaService.account.create({
				data: {
					userId: user.id,
					type: 'oauth',
					provider: profile.provider,
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: profile.expires_at
				}
			})
		}

		return this.saveSession(req, user)
	}

	/**
	 * Завершает текущую сессию пользователя.
	 * @param req - Объект запроса Express.
	 * @param res - Объект ответа Express.
	 * @returns Промис, который разрешается после завершения сессии.
	 * @throws InternalServerErrorException - Если возникла проблема при завершении сессии.
	 */
	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.'
						)
					)
				}
				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve()
			})
		})
	}

	/**
	 * Сохраняет сессию пользователя.
	 * @param req - Объект запроса Express.
	 * @param user - Объект пользователя.
	 * @returns Промис, который разрешается после сохранения сессии.
	 * @throws InternalServerErrorException - Если возникла проблема при сохранении сессии.
	 */
	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.'
						)
					)
				}

				resolve({
					user
				})
			})
		})
	}
}
