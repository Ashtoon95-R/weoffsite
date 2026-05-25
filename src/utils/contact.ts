import type { Locale } from '../i18n';
import { withTrailingSlash } from './paths';

const contactPaths: Record<Locale, string> = {
	es: '/contacto',
	en: '/contact',
};

export function getContactPath(locale: Locale): string {
	return contactPaths[locale];
}

export function getContactUrl(locale: Locale): string {
	return withTrailingSlash(`/${locale}${contactPaths[locale]}`);
}

/** Map contact paths between locales for the language switcher. */
export function getLocalizedPath(path: string, locale: Locale): string {
	if (path === '/contacto' || path === '/contact') {
		return contactPaths[locale];
	}
	return path;
}
