import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post
} from '@nestjs/common'
import { Recaptcha } from '@nestlab/google-recaptcha'

import { NewPasswordDto } from './dto/new-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { PasswordRecoveryService } from './password-recovery.service'

/**
 * Контроллер для управления восстановлением пароля.
 */
@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	/**
	 * Конструктор контроллера восстановления пароля.
	 * @param passwordRecoveryService - Сервис для управления восстановлением пароля.
	 */
	public constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	/**
	 * Запрашивает сброс пароля и отправляет токен на указанный email.
	 * @param dto - DTO с адресом электронной почты пользователя.
	 * @returns true, если токен успешно отправлен.
	 */
	@Recaptcha()
	@Post('reset')
	@HttpCode(HttpStatus.OK)
	public async resetPassword(@Body() dto: ResetPasswordDto) {
		return this.passwordRecoveryService.reset(dto)
	}

	/**
	 * Устанавливает новый пароль для пользователя.
	 * @param dto - DTO с новым паролем.
	 * @param token - Токен для сброса пароля.
	 * @returns true, если пароль успешно изменен.
	 */
	@Recaptcha()
	@Post('new/:token')
	@HttpCode(HttpStatus.OK)
	public async newPassword(
		@Body() dto: NewPasswordDto,
		@Param('token') token: string
	) {
		return this.passwordRecoveryService.new(dto, token)
	}
}
