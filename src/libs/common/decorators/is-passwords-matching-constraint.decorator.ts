import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { RegisterDto } from '@/auth/dto/register.dto'

/**
 * Ограничение для проверки совпадения паролей.
 *
 * Этот класс реализует интерфейс ValidatorConstraintInterface и используется
 * для проверки, совпадают ли два пароля в процессе валидации.
 */
@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint
	implements ValidatorConstraintInterface
{
	/**
	 * Проверяет, совпадает ли подтверждение пароля с основным паролем.
	 *
	 * @param passwordRepeat - Подтверждение пароля, введенное пользователем.
	 * @param args - Аргументы валидации, содержащие объект, который проверяется.
	 * @returns true, если пароли совпадают; иначе false.
	 */
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const obj = args.object as RegisterDto
		return obj.password === passwordRepeat
	}

	/**
	 * Возвращает сообщение по умолчанию, если валидация не прошла.
	 *
	 * @param validationArguments - Аргументы валидации.
	 * @returns Сообщение об ошибке.
	 */
	public defaultMessage(validationArguments?: ValidationArguments) {
		return 'Пароли не совпадают'
	}
}
