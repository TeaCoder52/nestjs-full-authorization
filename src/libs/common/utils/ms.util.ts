// Определение констант для различных единиц времени
const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

// Тип для различных единиц времени
type Unit =
	| 'Years'
	| 'Year'
	| 'Yrs'
	| 'Yr'
	| 'Y'
	| 'Weeks'
	| 'Week'
	| 'W'
	| 'Days'
	| 'Day'
	| 'D'
	| 'Hours'
	| 'Hour'
	| 'Hrs'
	| 'Hr'
	| 'H'
	| 'Minutes'
	| 'Minute'
	| 'Mins'
	| 'Min'
	| 'M'
	| 'Seconds'
	| 'Second'
	| 'Secs'
	| 'Sec'
	| 's'
	| 'Milliseconds'
	| 'Millisecond'
	| 'Msecs'
	| 'Msec'
	| 'Ms'

// Тип для единиц времени в любом регистре
type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>

// Тип для строкового значения, которое может содержать число и необязательную единицу времени
export type StringValue =
	| `${number}`
	| `${number}${UnitAnyCase}`
	| `${number} ${UnitAnyCase}`

/**
 * Преобразует строковое значение, представляющее время, в миллисекунды.
 *
 * @param str - Строка, представляющая количество времени, например, "1 hour", "60s", "500 milliseconds".
 * @returns Количество миллисекунд, соответствующее указанному времени.
 * @throws {Error} Если строка не соответствует ожидаемому формату или если единица времени не распознана.
 *
 * @example
 * ms('1 minute'); // вернет 60000
 * ms('2 hours'); // вернет 7200000
 * ms('500 ms'); // вернет 500
 */
export function ms(str: StringValue): number {
	// Проверка входных данных
	if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
		throw new Error(
			'Value provided to ms() must be a string with length between 1 and 99.'
		)
	}

	// Регулярное выражение для сопоставления строки с числом и необязательной единицей времени
	const match =
		/^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
			str
		)

	// Извлечение значения и типа из совпадения
	const groups = match?.groups as { value: string; type?: string } | undefined
	if (!groups) {
		return NaN
	}
	const n = parseFloat(groups.value)
	const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>

	// Преобразование строкового значения в миллисекунды в зависимости от единицы времени
	switch (type) {
		case 'years':
		case 'year':
		case 'yrs':
		case 'yr':
		case 'y':
			return n * y
		case 'weeks':
		case 'week':
		case 'w':
			return n * w
		case 'days':
		case 'day':
		case 'd':
			return n * d
		case 'hours':
		case 'hour':
		case 'hrs':
		case 'hr':
		case 'h':
			return n * h
		case 'minutes':
		case 'minute':
		case 'mins':
		case 'min':
		case 'm':
			return n * m
		case 'seconds':
		case 'second':
		case 'secs':
		case 'sec':
		case 's':
			return n * s
		case 'milliseconds':
		case 'millisecond':
		case 'msecs':
		case 'msec':
		case 'ms':
			return n
		default:
			throw new Error(
				`Ошибка: единица времени ${type} была распознана, но не существует соответствующего случая. Пожалуйста, проверьте введенные данные.`
			)
	}
}
