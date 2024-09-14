import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'

// Загружает переменные окружения из файла .env
dotenv.config()

/**
 * Проверяет, находится ли приложение в режиме разработки.
 * @param configService - Сервис конфигурации.
 * @returns true, если режим разработки; иначе false.
 */
export const isDev = (configService: ConfigService) =>
	configService.getOrThrow('NODE_ENV') === 'development'

/**
 * Определяет, работает ли приложение в режиме разработки.
 */
export const IS_DEV_ENV = process.env.NODE_ENV === 'development'
