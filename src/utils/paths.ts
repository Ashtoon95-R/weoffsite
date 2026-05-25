import type { Locale } from '../i18n';

/** Ensures internal paths end with `/` before any hash fragment. */
export function withTrailingSlash(path: string): string {
	const hashIndex = path.indexOf('#');
	if (hashIndex === -1) {
		return path.endsWith('/') ? path : `${path}/`;
	}

	const pathname = path.slice(0, hashIndex);
	const hash = path.slice(hashIndex);
	const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
	return `${normalized}${hash}`;
}

export function localePath(locale: Locale, ...segments: string[]): string {
	const parts = segments.filter(Boolean).map((segment) => segment.replace(/^\/+|\/+$/g, ''));
	const pathname = parts.length ? `/${locale}/${parts.join('/')}` : `/${locale}/`;
	return withTrailingSlash(pathname);
}

export function localeHome(locale: Locale): string {
	return `/${locale}/`;
}
