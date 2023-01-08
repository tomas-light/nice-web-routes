import { isNullOrUndefined } from './isNullOrUndefined';

class UrlBuilder {
	private pathname = '';
	private searchParams: Record<string, string> = {};

	addPathnameIfExists(pathname?: string) {
		if (!pathname) {
			return this;
		}
		this.pathname += pathname;
		return this;
	}

	addSearchParamsIfExists(searchParams?: Record<string, string>) {
		if (!searchParams) {
			return this;
		}
		this.searchParams = {
			...this.searchParams,
			...searchParams,
		};
		return this;
	}

	build() {
		const urlBase = 'http://to-be-removed';
		// we can't build url without mandatory part
		const url = new URL(this.pathname, urlBase);

		Object.entries(this.searchParams).forEach(([name, value]) => {
			if (!isNullOrUndefined(value)) {
				url.searchParams.append(name, value.toString());
			}
		});

		// remove extra part in url
		return url.toString().substring(urlBase.length);
	}
}

export { UrlBuilder };
