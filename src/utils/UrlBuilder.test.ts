import { UrlBuilder } from './UrlBuilder';

test('if url with only pathname will be built correctly', () => {
	const builder = new UrlBuilder();
	const url = builder.addPathnameIfExists('/some-url/with-nested/routes').build();
	expect(url).toBe('/some-url/with-nested/routes');
});

test('if url with only search params will be built correctly', () => {
	const builder = new UrlBuilder();
	const url = builder
		.addSearchParamsIfExists({
			one: '1',
			two: '2',
			three: 'three',
		})
		.build();
	expect(url).toBe('/?one=1&two=2&three=three');
});

test('if concatenation of pathname skips an empty strings', () => {
	const builder = new UrlBuilder();
	const url = builder.addPathnameIfExists('/some-url').addPathnameIfExists('').addPathnameIfExists('/routes').build();
	expect(url).toBe('/some-url/routes');
});

test('if url with pathname and search params will be built correctly', () => {
	const builder = new UrlBuilder();
	const url = builder
		.addPathnameIfExists('/some-url/with-nested/routes')
		.addSearchParamsIfExists({
			one: '1',
			two: '2',
			three: 'three',
		})
		.build();
	expect(url).toBe('/some-url/with-nested/routes?one=1&two=2&three=three');
});

test('if nullable search params will ignored', () => {
	const builder = new UrlBuilder();
	const url = builder
		.addSearchParamsIfExists({
			one: '1',
			two: null as unknown as string, // it should be ignored
			three: 'three',
		})
		.build();
	expect(url).toBe('/?one=1&three=three');
});
