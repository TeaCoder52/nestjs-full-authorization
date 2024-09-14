import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/__generated__'

/**
 * Декоратор для получения авторизованного пользователя из контекста запроса.
 *
 * Этот декоратор позволяет извлекать данные пользователя из объекта запроса.
 * Если указан параметр, возвращает конкретное свойство пользователя,
 * иначе возвращает весь объект пользователя.
 *
 * @param data - Имя свойства пользователя, которое нужно извлечь.
 * @param ctx - Контекст выполнения, содержащий информацию о текущем запросе.
 * @returns Значение свойства пользователя или весь объект пользователя.
 */
export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user

		return data ? user[data] : user
	}
)
