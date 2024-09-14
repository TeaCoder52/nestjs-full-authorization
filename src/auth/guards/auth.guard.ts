import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'

import { UserService } from '@/user/user.service'

/**
 * Guard для проверки аутентификации пользователя.
 */
@Injectable()
export class AuthGuard implements CanActivate {
	/**
	 * Конструктор охранителя аутентификации.
	 * @param userService - Сервис для работы с пользователями.
	 */
	public constructor(private readonly userService: UserService) {}

	/**
	 * Проверяет, имеет ли пользователь доступ к ресурсу.
	 * @param context - Контекст выполнения, содержащий информацию о текущем запросе.
	 * @returns true, если пользователь аутентифицирован; в противном случае выбрасывает UnauthorizedException.
	 * @throws UnauthorizedException - Если пользователь не авторизован.
	 */
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(
				'Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.'
			)
		}

		const user = await this.userService.findById(request.session.userId)

		request.user = user

		return true
	}
}
