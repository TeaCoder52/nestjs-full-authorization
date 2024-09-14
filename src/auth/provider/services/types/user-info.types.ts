/**
 * Информация о пользователе, полученная от OAuth-провайдера.
 *
 * Этот тип описывает структуру данных, содержащую информацию о пользователе,
 * включая токены доступа и информацию о провайдере.
 */
export type TypeUserInfo = {
	id: string
	picture: string
	name: string
	email: string
	access_token?: string | null
	refresh_token?: string
	expires_at?: number
	provider: string
}
