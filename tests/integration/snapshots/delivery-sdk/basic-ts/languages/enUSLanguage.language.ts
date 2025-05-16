import type { LanguageCodenames } from './_languages.ts';

/*
 * Type representing codename of 'English' language
 */
export type EnUSLanguageCodename = Extract<LanguageCodenames, 'en-US'>;

/*
 * Typeguard for codename of 'English' language
 */
export function isEnUSLanguageCodename(value: string | undefined | null): value is EnUSLanguageCodename {
	return typeof value === 'string' && value === ('en-US' satisfies EnUSLanguageCodename);
}
