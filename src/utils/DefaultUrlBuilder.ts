import { isNullOrUndefined } from './isNullOrUndefined';
import { joinRouteSegments } from './joinRouteSegments';
import { UrlBuilder } from './UrlBuilder';

class DefaultUrlBuilder implements UrlBuilder {
  private pathname = '';
  private searchParams: Record<string, string> = {};
  private additionalString = '';

  addPathnameIfExists(pathname?: string) {
    if (!pathname) {
      return this;
    }
    this.pathname = joinRouteSegments(this.pathname, pathname);
    return this;
  }

  addSearchParamsIfExists(searchParams?: Record<string, string> | string) {
    if (!searchParams) {
      return this;
    }

    if (typeof searchParams === 'string') {
      this.additionalString = searchParams;
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
    let builtUrl = url.toString().substring(urlBase.length);
    if (this.additionalString) {
      builtUrl += this.additionalString;
    }

    return builtUrl;
  }
}

export { DefaultUrlBuilder };
