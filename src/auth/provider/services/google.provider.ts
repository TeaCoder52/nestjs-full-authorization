import { BaseOAuthService } from './base-oauth.service'
import { TypeProviderOptions } from './types/provider-options.types'
import { TypeUserInfo } from './types/user-info.types'

/**
 * Провайдер для работы с OAuth Google.
 */
export class GoogleProvider extends BaseOAuthService {
	/**
	 * Конструктор провайдера Google.
	 *
	 * @param options - Опции провайдера, содержащие необходимые параметры для аутентификации.
	 */
	public constructor(options: TypeProviderOptions) {
		super({
			name: 'google',
			authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
			access_url: 'https://oauth2.googleapis.com/token',
			profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		})
	}

	/**
	 * Извлекает информацию о пользователе из данных, полученных от Google.
	 *
	 * @param data - Данные профиля пользователя от Google.
	 * @returns Объект с информацией о пользователе.
	 */
	public async extractUserInfo(data: GoogleProfile): Promise<TypeUserInfo> {
		return super.extractUserInfo({
			email: data.email,
			name: data.name,
			picture: data.picture
		})
	}
}

/**
 * Интерфейс для данных профиля пользователя Google.
 */
interface GoogleProfile extends Record<string, any> {
	aud: string
	azp: string
	email: string
	email_verified: boolean
	exp: number
	family_name?: string
	given_name: string
	hd?: string
	iat: number
	iss: string
	jti?: string
	locale?: string
	name: string
	nbf?: number
	picture: string
	sub: string
	access_token: string
	refresh_token?: string
}
