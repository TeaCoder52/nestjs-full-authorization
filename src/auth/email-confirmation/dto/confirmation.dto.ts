import { IsNotEmpty, IsString } from 'class-validator'

/**
 * DTO для подтверждения электронной почты.
 */
export class ConfirmationDto {
	/**
	 * Токен подтверждения.
	 * @example "123e4567-e89b-12d3-a456-426614174000"
	 */
	@IsString({ message: 'Токен должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле токен не может быть пустым.' })
	token: string
}
