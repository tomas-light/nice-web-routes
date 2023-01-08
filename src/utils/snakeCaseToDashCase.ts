export function snakeCaseToDashCase(segment: string) {
	return segment?.replaceAll('_', '-') ?? '';
}
