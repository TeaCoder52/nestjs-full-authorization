import { Inject, Injectable, OnModuleInit } from '@nestjs/common'

import { ProviderOptionsSymbol, TypeOptions } from './provider.constants'
import { BaseOAuthService } from './services/base-oauth.service'

/**
 * Сервис для управления провайдерами OAuth.
 */
@Injectable()
export class ProviderService implements OnModuleInit {
	/**
	 * Конструктор сервиса провайдеров.
	 *
	 * @param options - Опции провайдера, содержащие базовый URL и сервисы.
	 */
	public constructor(
		@Inject(ProviderOptionsSymbol) private readonly options: TypeOptions
	) {}

	/**
	 * Инициализация модуля.
	 *
	 * Устанавливает базовый URL для всех сервисов провайдеров.
	 */
	public onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	/**
	 * Находит сервис провайдера по имени.
	 *
	 * @param service - Имя сервиса провайдера.
	 * @returns Сервис провайдера или null, если не найден.
	 */
	public findByService(service: string): BaseOAuthService | null {
		return this.options.services.find(s => s.name === service) ?? null
	}
}
