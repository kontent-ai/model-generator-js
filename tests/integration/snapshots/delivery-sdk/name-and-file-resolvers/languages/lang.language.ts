import type { LanguageCodenames } from './_languages.js';

/*
 * Type representing codename of entity
 *
 * Name: 🦉Lang
 * Codename: 🦉Lang
 * Type: Language
 */
export type LangLanguageCodename = Extract<LanguageCodenames, '🦉Lang'>;

/*
 * Type guard for 🦉Lang
 *
 * Name: 🦉Lang
 * Codename: 🦉Lang
 * Type: Language
 */
export function isLangLanguageCodename(value: string | undefined | null): value is LangLanguageCodename {
	return typeof value === 'string' && value === ('🦉Lang' satisfies LangLanguageCodename);
}
