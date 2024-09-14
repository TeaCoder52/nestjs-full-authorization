/**
 * Преобразует строковое значение в логическое значение (boolean).
 *
 * Эта функция принимает строку, представляющую логическое значение,
 * и возвращает соответствующее логическое значение. Если строка равна
 * "true" (игнорируя регистр), функция вернет `true`. Если строка равна
 * "false", функция вернет `false`. Если передано значение другого типа
 * или строка не соответствует ожидаемым значениям, будет выброшено
 * исключение.
 *
 * @param value - Строка, представляющая логическое значение ("true" или "false").
 * @returns {boolean} Логическое значение, соответствующее переданной строке.
 * @throws {Error} Если переданное значение не может быть преобразовано в логическое значение.
 *
 * @example
 * parseBoolean('true');  // вернет true
 * parseBoolean('false'); // вернет false
 * parseBoolean('TRUE');  // вернет true
 * parseBoolean('False'); // вернет false
 */
export function parseBoolean(value: string): boolean {
	if (typeof value === 'boolean') {
		return value
	}

	if (typeof value === 'string') {
		const lowerValue = value.trim().toLowerCase()
		if (lowerValue === 'true') {
			return true
		}
		if (lowerValue === 'false') {
			return false
		}
	}

	throw new Error(
		`Не удалось преобразовать значение "${value}" в логическое значение.`
	)
}
