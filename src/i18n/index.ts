import es from './es.json';
import en from './en.json';
import { withTrailingSlash } from '../utils/paths';

export type Locale = 'en' | 'es';
export type Translations = typeof en;

const translations: Record<Locale, Translations> = { en, es };

export function getTranslations(locale: Locale): Translations {
	return translations[locale];
}

/** Path without /en or /es prefix (e.g. "/about", "/case-studies/foo", or "/" for home). */
export function getPathWithoutLocale(pathname: string): string {
	const stripped = pathname.replace(/^\/(en|es)(?=\/|$)/, '');
	return stripped === '' ? '/' : stripped;
}

/** Relative URL for the language switcher — stays on the same page in the other locale. */
export function getLocaleSwitchUrl(locale: Locale, pathname: string, hash = ''): string {
	let path = getPathWithoutLocale(pathname);
	if (path === '/contacto' || path === '/contact') {
		path = locale === 'es' ? '/contacto' : '/contact';
	}
	if (path === '/') {
		return `/${locale}/${hash}`;
	}
	return withTrailingSlash(`/${locale}${path}`) + hash;
}
