import type { LanguageCodenames } from './_languages.ts';

/*
 * Type representing codename of 'Spanish' language
 */
export type EsESLanguageCodename = Extract<LanguageCodenames, 'es-ES'>;

/*
 * Typeguard for codename of 'Spanish' language
 */
export function isEsESLanguageCodename(value: string | undefined | null): value is EsESLanguageCodename {
	return typeof value === 'string' && value === ('es-ES' satisfies EsESLanguageCodename);
}
