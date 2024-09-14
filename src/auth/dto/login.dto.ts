import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

/**
 * DTO для входа пользователя в систему.
 */
export class LoginDto {
	/**
	 * Email пользователя.
	 * @example example@example.com
	 */
	@IsString({ message: 'Email должен быть строкой.' })
	@IsEmail({}, { message: 'Некорректный формат email.' })
	@IsNotEmpty({ message: 'Email обязателен для заполнения.' })
	email: string

	/**
	 * Пароль пользователя.
	 * @example password123
	 */
	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле пароль не может быть пустым.' })
	@MinLength(6, { message: 'Пароль должен содержать не менее 6 символов.' })
	password: string

	/**
	 * Код двухфакторной аутентификации (необязательно).
	 * @example 123456
	 */
	@IsOptional()
	@IsString()
	code: string
}
