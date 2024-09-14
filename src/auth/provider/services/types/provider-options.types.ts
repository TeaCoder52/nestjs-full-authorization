/**
 * Опции провайдера OAuth.
 *
 * Этот тип описывает параметры, необходимые для настройки провайдера OAuth.
 */
export type TypeProviderOptions = {
	scopes: string[]
	client_id: string
	client_secret: string
}
