import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType } from '@prisma/__generated__'

import { MailService } from '@/libs/mail/mail.service'
import { PrismaService } from '@/prisma/prisma.service'

/**
 * Сервис для управления двухфакторной аутентификацией.
 */
@Injectable()
export class TwoFactorAuthService {
	/**
	 * Конструктор сервиса двухфакторной аутентификации.
	 * @param prismaService - Сервис для работы с базой данных Prisma.
	 * @param mailService - Сервис для отправки email-сообщений.
	 */
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	/**
	 * Проверяет токен двухфакторной аутентификации.
	 * @param email - Адрес электронной почты пользователя.
	 * @param code - Код двухфакторной аутентификации, введенный пользователем.
	 * @returns true, если токен действителен; в противном случае выбрасывает исключения.
	 * @throws NotFoundException - Если токен не найден.
	 * @throws BadRequestException - Если код неверен или срок действия токена истек.
	 */
	public async validateTwoFactorToken(email: string, code: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Токен двухфакторной аутентификации не найден. Убедитесь, что вы запрашивали токен для данного адреса электронной почты.'
			)
		}

		if (existingToken.token !== code) {
			throw new BadRequestException(
				'Неверный код двухфакторной аутентификации. Пожалуйста, проверьте введенный код и попробуйте снова.'
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				'Срок действия токена двухфакторной аутентификации истек. Пожалуйста, запросите новый токен.'
			)
		}

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		})

		return true
	}

	/**
	 * Отправляет токен двухфакторной аутентификации на указанный email.
	 * @param email - Адрес электронной почты пользователя, которому нужно отправить токен.
	 * @returns true, если токен успешно отправлен.
	 */
	public async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateTwoFactorToken(email)

		await this.mailService.sendTwoFactorTokenEmail(
			twoFactorToken.email,
			twoFactorToken.token
		)

		return true
	}

	/**
	 * Генерирует новый токен двухфакторной аутентификации.
	 * @param email - Адрес электронной почты пользователя.
	 * @returns Объект токена двухфакторной аутентификации.
	 */
	private async generateTwoFactorToken(email: string) {
		const token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()
		const expiresIn = new Date(new Date().getTime() + 300000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR
				}
			})
		}

		const twoFactorToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR
			}
		})

		return twoFactorToken
	}
}
