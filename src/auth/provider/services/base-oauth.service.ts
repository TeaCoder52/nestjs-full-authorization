import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'

import { TypeBaseProviderOptions } from './types/base-provider-options.types'
import { TypeUserInfo } from './types/user-info.types'

/**
 * Базовый сервис для работы с OAuth-провайдерами.
 *
 * Этот сервис предоставляет общие методы для аутентификации через OAuth, такие как
 * получение URL для авторизации, извлечение информации о пользователе и обработка токенов.
 */
@Injectable()
export class BaseOAuthService {
	private BASE_URL: string

	/**
	 * Конструктор базового сервиса OAuth.
	 *
	 * @param options - Опции провайдера, содержащие необходимые параметры для аутентификации.
	 */
	public constructor(private readonly options: TypeBaseProviderOptions) {}

	/**
	 * Извлекает информацию о пользователе из данных, полученных от провайдера.
	 *
	 * @param data - Данные, полученные от провайдера.
	 * @returns Объект с информацией о пользователе, включая имя провайдера.
	 */
	protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
		return {
			...data,
			provider: this.options.name
		}
	}

	/**
	 * Формирует URL для авторизации.
	 *
	 * @returns URL для авторизации пользователя через OAuth.
	 */
	public getAuthUrl() {
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scopes ?? []).join(' '),
			access_type: 'offline',
			prompt: 'select_account'
		})

		return `${this.options.authorize_url}?${query}`
	}

	/**
	 * Находит пользователя по коду авторизации и возвращает информацию о пользователе.
	 *
	 * @param code - Код авторизации, полученный от провайдера.
	 * @returns Объект с информацией о пользователе.
	 * @throws BadRequestException - Если не удалось получить токены или пользователь.
	 * @throws UnauthorizedException - Если токен доступа недействителен.
	 */
	public async findUserByCode(code: string): Promise<TypeUserInfo> {
		const client_id = this.options.client_id
		const client_secret = this.options.client_secret

		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			code,
			redirect_uri: this.getRedirectUrl(),
			grant_type: 'authorization_code'
		})

		const tokensRequest = await fetch(this.options.access_url, {
			method: 'POST',
			body: tokenQuery,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json'
			}
		})

		if (!tokensRequest.ok) {
			throw new BadRequestException(
				`Не удалось получить пользователя с ${this.options.profile_url}. Проверьте правильность токена доступа.`
			)
		}

		const tokens = await tokensRequest.json()

		if (!tokens.access_token) {
			throw new BadRequestException(
				`Нет токенов с ${this.options.access_url}. Убедитесь, что код авторизации действителен.`
			)
		}

		const userRequest = await fetch(this.options.profile_url, {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`
			}
		})

		if (!userRequest.ok) {
			throw new UnauthorizedException(
				`Не удалось получить пользователя с ${this.options.profile_url}. Проверьте правильность токена доступа.`
			)
		}

		const user = await userRequest.json()
		const userData = await this.extractUserInfo(user)

		return {
			...userData,
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			expires_at: tokens.expires_at || tokens.expires_in,
			provider: this.options.name
		}
	}

	/**
	 * Возвращает URL для перенаправления после успешной аутентификации.
	 *
	 * @returns URL для перенаправления.
	 */
	private getRedirectUrl() {
		return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`
	}

	/**
	 * Устанавливает базовый URL для сервиса.
	 *
	 * @param value - Новый базовый URL.
	 */
	public set baseUrl(value: string) {
		this.BASE_URL = value
	}

	/**
	 * Возвращает имя провайдера.
	 *
	 * @returns Имя провайдера.
	 */
	public get name() {
		return this.options.name
	}

	/**
	 * Возвращает URL для доступа.
	 *
	 * @returns URL для доступа.
	 */
	public get access_url() {
		return this.options.access_url
	}

	/**
	 * Возвращает URL для профиля.
	 *
	 * @returns URL для профиля.
	 */
	public get profile_url() {
		return this.options.profile_url
	}

	/**
	 * Возвращает массив с областями доступа.
	 *
	 * @returns Массив областей доступа.
	 */
	public get scopes() {
		return this.options.scopes
	}
}
