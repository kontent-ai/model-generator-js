import type { LanguageCodenames } from './_languages.ts';

/*
 * Type representing codename of entity
 *
 * Name: __jp
 * Codename: __jp
 * Type: Language
 */
export type JpLanguageCodename = Extract<LanguageCodenames, '__jp'>;

/*
 * Type guard for __jp
 *
 * Name: __jp
 * Codename: __jp
 * Type: Language
 */
export function isJpLanguageCodename(value: string | undefined | null): value is JpLanguageCodename {
	return typeof value === 'string' && value === ('__jp' satisfies JpLanguageCodename);
}
