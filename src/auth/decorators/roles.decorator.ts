import { SetMetadata } from '@nestjs/common'
import { UserRole } from '@prisma/__generated__'

export const ROLES_KEY = 'roles'

/**
 * Декоратор для установки метаданных ролей.
 *
 * Этот декоратор позволяет указать роли, необходимые для доступа к методу или классу.
 *
 * @param roles - Массив ролей, которые должны быть установлены в метаданных.
 * @returns Функция SetMetadata, устанавливающая роли в метаданных.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
