import type { LanguageCodenames } from './_languages.js';

/*
 * Type representing codename of '__jp' language
 */
export type JpLanguageCodename = Extract<LanguageCodenames, '__jp'>;

/*
 * Typeguard for codename of '__jp' language
 */
export function isJpLanguageCodename(value: string | undefined | null): value is JpLanguageCodename {
	return typeof value === 'string' && value === ('__jp' satisfies JpLanguageCodename);
}
