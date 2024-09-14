import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma/__generated__'

import { ROLES_KEY } from '../decorators/roles.decorator'

/**
 * Guard для проверки ролей пользователя.
 */
@Injectable()
export class RolesGuard implements CanActivate {
	/**
	 * Конструктор охранителя ролей.
	 * @param reflector - Рефлектор для получения метаданных.
	 */
	public constructor(private readonly reflector: Reflector) {}

	/**
	 * Проверяет, имеет ли пользователь необходимые роли для доступа к ресурсу.
	 * @param context - Контекст выполнения, содержащий информацию о текущем запросе.
	 * @returns true, если у пользователя достаточно прав; в противном случае выбрасывает ForbiddenException.
	 * @throws ForbiddenException - Если у пользователя недостаточно прав.
	 */
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])
		const request = context.switchToHttp().getRequest()

		if (!roles) return true

		if (!roles.includes(request.user.role)) {
			throw new ForbiddenException(
				'Недостаточно прав. У вас нет прав доступа к этому ресурсу.'
			)
		}

		return true
	}
}
