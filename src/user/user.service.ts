import { Injectable, NotFoundException } from '@nestjs/common'
import { AuthMethod } from '@prisma/__generated__'
import { hash } from 'argon2'

import { PrismaService } from '@/prisma/prisma.service'

import { UpdateUserDto } from './dto/update-user.dto'

/**
 * Сервис для работы с пользователями.
 */
@Injectable()
export class UserService {
	/**
	 * Конструктор сервиса пользователей.
	 * @param prismaService - Сервис для работы с базой данных Prisma.
	 */
	public constructor(private readonly prismaService: PrismaService) {}

	/**
	 * Находит пользователя по ID.
	 * @param {string} id - ID пользователя.
	 * @returns {Promise<User>} Найденный пользователь.
	 * @throws {NotFoundException} Если пользователь не найден.
	 */
	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				accounts: true
			}
		})

		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введенные данные.'
			)
		}

		return user
	}

	/**
	 * Находит пользователя по email.
	 * @param {string} email - Email пользователя.
	 * @returns {Promise<User | null>} Найденный пользователь или null, если не найден.
	 */
	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	/**
	 * Создает нового пользователя.
	 * @param email - Email пользователя.
	 * @param password - Пароль пользователя.
	 * @param displayName - Отображаемое имя пользователя.
	 * @param picture - URL аватара пользователя.
	 * @param method - Метод аутентификации пользователя.
	 * @param isVerified - Флаг, указывающий, подтвержден ли email пользователя.
	 * @returns Созданный пользователь.
	 */
	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethod,
		isVerified: boolean
	) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				displayName,
				picture,
				method,
				isVerified
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	/**
	 * Обновляет данные пользователя.
	 * @param userId - ID пользователя.
	 * @param dto - Данные для обновления пользователя.
	 * @returns Обновленный пользователь.
	 */
	public async update(userId: string, dto: UpdateUserDto) {
		const user = await this.findById(userId)

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				email: dto.email,
				displayName: dto.name,
				isTwoFactorEnabled: dto.isTwoFactorEnabled
			}
		})

		return updatedUser
	}
}
