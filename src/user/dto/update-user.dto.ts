import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'

/**
 * DTO для обновления данных пользователя.
 */
export class UpdateUserDto {
	/**
	 * Имя пользователя.
	 * @example Иван Иванов
	 */
	@IsString({ message: 'Имя должно быть строкой.' })
	@IsNotEmpty({ message: 'Имя обязательно для заполнения.' })
	name: string

	/**
	 * Email пользователя.
	 * @example example@example.com
	 */
	@IsString({ message: 'Email должен быть строкой.' })
	@IsEmail({}, { message: 'Некорректный формат email.' })
	@IsNotEmpty({ message: 'Email обязателен для заполнения.' })
	email: string

	/**
	 * Флаг, указывающий, включена ли двухфакторная аутентификация.
	 */
	@IsBoolean({ message: 'isTwoFactorEnabled должно быть булевым значением.' })
	isTwoFactorEnabled: boolean
}
