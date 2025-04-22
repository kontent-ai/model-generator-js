import type { LanguageCodenames } from './_languages.js';

/*
 * Type representing codename of 🦉Lang
 *
 * Codename: 🦉Lang
 */
export type LangLanguageCodename = Extract<LanguageCodenames, '🦉Lang'>;

/*
 * Type guard for 🦉Lang entity
 *
 * Codename: 🦉Lang
 */
export function isLangLanguageCodename(value: string | undefined | null): value is LangLanguageCodename {
	return typeof value === 'string' && value === ('🦉Lang' satisfies LangLanguageCodename);
}
