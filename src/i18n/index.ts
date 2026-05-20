import es from './es.json';
import en from './en.json';

export type Locale = 'en' | 'es';

const translations = { es, en } as const;

export function getTranslations(locale: Locale) {
	return translations[locale];
}
