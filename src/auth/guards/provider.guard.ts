import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Request } from 'express'

import { ProviderService } from '../provider/provider.service'

/**
 * Guard для проверки наличия провайдера аутентификации.
 */
@Injectable()
export class AuthProviderGuard implements CanActivate {
	/**
	 * Конструктор охранителя провайдера аутентификации.
	 * @param providerService - Сервис для работы с провайдерами аутентификации.
	 */
	public constructor(private readonly providerService: ProviderService) {}

	/**
	 * Проверяет, существует ли указанный провайдер аутентификации.
	 * @param context - Контекст выполнения, содержащий информацию о текущем запросе.
	 * @returns true, если провайдер найден; в противном случае выбрасывает NotFoundException.
	 * @throws NotFoundException - Если провайдер не найден.
	 */
	public canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest() as Request

		const provider = request.params.provider

		const providerInstance = this.providerService.findByService(provider)

		if (!providerInstance) {
			throw new NotFoundException(
				`Провайдер "${provider}" не найден. Пожалуйста, проверьте правильность введенных данных.`
			)
		}

		return true
	}
}
