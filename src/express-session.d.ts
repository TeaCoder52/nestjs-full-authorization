import 'express-session'

declare module 'express-session' {
	/**
	 * Расширяет стандартный интерфейс SessionData, добавляя свойство userId.
	 * Свойство userId будет доступно в объекте сессии.
	 */
	interface SessionData {
		userId?: string
	}
}
