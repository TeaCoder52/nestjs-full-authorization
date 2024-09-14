import { DynamicModule, Module } from '@nestjs/common'

import {
	ProviderOptionsSymbol,
	TypeAsyncOptions,
	TypeOptions
} from './provider.constants'
import { ProviderService } from './provider.service'

/**
 * Модуль для управления провайдерами OAuth.
 */
@Module({})
export class ProviderModule {
	/**
	 * Регистрация модуля провайдеров с синхронными опциями.
	 *
	 * @param options - Опции провайдера, содержащие базовый URL и сервисы.
	 * @returns Динамический модуль провайдеров.
	 */
	public static register(options: TypeOptions): DynamicModule {
		return {
			module: ProviderModule,
			providers: [
				{
					useValue: options.services,
					provide: ProviderOptionsSymbol
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}

	/**
	 * Регистрация модуля провайдеров с асинхронными опциями.
	 *
	 * @param options - Асинхронные опции провайдера, включая импорты и фабричные функции.
	 * @returns Динамический модуль провайдеров.
	 */
	public static registerAsync(options: TypeAsyncOptions): DynamicModule {
		return {
			module: ProviderModule,
			imports: options.imports,
			providers: [
				{
					useFactory: options.useFactory,
					provide: ProviderOptionsSymbol,
					inject: options.inject
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}
}
