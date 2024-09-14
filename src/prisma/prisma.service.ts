import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/__generated__'

/**
 * Сервис для работы с Prisma.
 *
 * Управляет соединением с базой данных в рамках жизненного цикла модуля.
 */
@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	/**
	 * Устанавливает соединение с базой данных при инициализации модуля.
	 *
	 * @returns Промис, который разрешается после подключения.
	 */
	public async onModuleInit(): Promise<void> {
		await this.$connect()
	}

	/**
	 * Закрывает соединение с базой данных при уничтожении модуля.
	 *
	 * @returns Промис, который разрешается после отключения.
	 */
	public async onModuleDestroy(): Promise<void> {
		await this.$disconnect()
	}
}
