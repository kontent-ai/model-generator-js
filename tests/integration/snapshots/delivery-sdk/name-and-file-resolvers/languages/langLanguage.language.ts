import type { LanguageCodenames } from './_languages.js';

/*
 * Type representing codename of '🦉Lang' language
 */
export type LangLanguageCodename = Extract<LanguageCodenames, '🦉Lang'>;

/*
 * Typeguard for codename of '🦉Lang' language
 */
export function isLangLanguageCodename(value: string | undefined | null): value is LangLanguageCodename {
	return typeof value === 'string' && value === ('🦉Lang' satisfies LangLanguageCodename);
}
