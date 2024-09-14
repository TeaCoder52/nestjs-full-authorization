import { FactoryProvider, ModuleMetadata } from '@nestjs/common'

import { BaseOAuthService } from './services/base-oauth.service'

/**
 * Символ для идентификации опций провайдера.
 */
export const ProviderOptionsSymbol = Symbol()

/**
 * Тип для опций провайдера.
 *
 * Этот тип описывает базовый URL и массив сервисов OAuth.
 */
export type TypeOptions = {
	baseUrl: string
	services: BaseOAuthService[]
}

/**
 * Тип для асинхронных опций провайдера.
 *
 * Этот тип описывает асинхронные опции, включая импорты и фабричные функции.
 */
export type TypeAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>
