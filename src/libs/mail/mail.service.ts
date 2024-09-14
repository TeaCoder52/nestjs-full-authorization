import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { ConfirmationTemplate } from './templates/confirmation.template'
import { ResetPasswordTemplate } from './templates/reset-password.template'
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template'

/**
 * Сервис для отправки email-сообщений.
 *
 * Этот сервис предоставляет методы для отправки различных типов email-сообщений,
 * включая подтверждение почты, сброс пароля и двухфакторную аутентификацию.
 */
@Injectable()
export class MailService {
	/**
	 * Конструктор сервиса почты.
	 * @param mailerService - Сервис для работы с отправкой email.
	 * @param configService - Сервис для работы с конфигурацией приложения.
	 */
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	/**
	 * Отправляет email для подтверждения почты.
	 * @param email - Адрес электронной почты получателя.
	 * @param token - Токен подтверждения.
	 * @returns Промис, который разрешается при успешной отправке.
	 */
	public async sendConfirmationEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ConfirmationTemplate({ domain, token }))

		return this.sendMail(email, 'Подтверждение почты', html)
	}

	/**
	 * Отправляет email для сброса пароля.
	 * @param email - Адрес электронной почты получателя.
	 * @param token - Токен для сброса пароля.
	 * @returns Промис, который разрешается при успешной отправке.
	 */
	public async sendPasswordResetEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ResetPasswordTemplate({ domain, token }))

		return this.sendMail(email, 'Сброс пароля', html)
	}

	/**
	 * Отправляет email с токеном двухфакторной аутентификации.
	 * @param email - Адрес электронной почты получателя.
	 * @param token - Токен двухфакторной аутентификации.
	 * @returns Промис, который разрешается при успешной отправке.
	 */
	public async sendTwoFactorTokenEmail(email: string, token: string) {
		const html = await render(TwoFactorAuthTemplate({ token }))

		return this.sendMail(email, 'Подтверждение вашей личности', html)
	}

	/**
	 * Отправляет email-сообщение.
	 * @param email - Адрес электронной почты получателя.
	 * @param subject - Тема email-сообщения.
	 * @param html - HTML-содержимое email-сообщения.
	 * @returns Промис, который разрешается при успешной отправке.
	 */
	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
