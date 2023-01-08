import { isNullOrUndefined } from './utils';

const DEFAULT_ARGUMENT_ASSIGNMENT_SIGN = '=';

// supports only one argument
/**
 * @example
 * const fn = (arg = 'default value') => {...};
 * // returns 'default value'
 */
function getStringDefaultValueForArgument(fn: (argument?: string) => any) {
	const argumentsDescription = getFunctionDefinitionContentBetweenBraces(fn);

	const hasDefaultValue = argumentsDescription.includes(DEFAULT_ARGUMENT_ASSIGNMENT_SIGN);
	if (!hasDefaultValue) {
		return undefined;
	}

	const [name, defaultValue] = argumentsDescription.split(DEFAULT_ARGUMENT_ASSIGNMENT_SIGN);
	if (isNullOrUndefined(defaultValue) || defaultValue === '') {
		return undefined;
	}

	const sanitizedValue = sanitizeDefaultValue(defaultValue);
	return sanitizedValue;
}

/**
 * @example
 * const fn = (arg = 'default value') => {...};
 * const result = getFunctionDefinitionContentBetweenBraces(fn);
 * // result is "arg = 'default value'"
 */
function getFunctionDefinitionContentBetweenBraces(fn: (argument?: string) => any) {
	const functionDescription = fn.toString();
	const argumentsStartIndex = functionDescription.indexOf('(');
	const argumentsEndIndex = functionDescription.indexOf(')');

	return functionDescription.slice(argumentsStartIndex + 1, argumentsEndIndex);
}

// ':userId' / ":userId" => :userId
function sanitizeDefaultValue(dirtDefaultValue: string) {
	/* eslint-disable quotes */
	const singleQuote = `'`;
	const doubleQuote = `"`;
	/* eslint-enable quotes */

	return dirtDefaultValue.trim().replaceAll(singleQuote, '').replaceAll(doubleQuote, '');
}

export { getStringDefaultValueForArgument };
