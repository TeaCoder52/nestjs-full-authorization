import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch
} from '@nestjs/common'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

/**
 * Контроллер для управления пользователями.
 */
@Controller('users')
export class UserController {
	/**
	 * Конструктор контроллера пользователей.
	 * @param userService - Сервис для работы с пользователями.
	 */
	public constructor(private readonly userService: UserService) {}

	/**
	 * Получает профиль текущего пользователя.
	 * @param userId - ID авторизованного пользователя.
	 * @returns Профиль пользователя.
	 */
	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	public async findProfile(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}

	/**
	 * Получает пользователя по ID (доступно только администраторам).
	 * @param id - ID пользователя.
	 * @returns Найденный пользователь.
	 */
	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Get('by-id/:id')
	public async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	/**
	 * Обновляет профиль текущего пользователя.
	 * @param userId - ID авторизованного пользователя.
	 * @param dto - Данные для обновления профиля.
	 * @returns Обновленный профиль пользователя.
	 */
	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch('profile')
	public async updateProfile(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(userId, dto)
	}
}
