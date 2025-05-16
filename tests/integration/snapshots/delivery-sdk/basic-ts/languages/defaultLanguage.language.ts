import type { LanguageCodenames } from './_languages.ts';

/*
 * Type representing codename of 'Default project language' language
 */
export type DefaultLanguageCodename = Extract<LanguageCodenames, 'default'>;

/*
 * Typeguard for codename of 'Default project language' language
 */
export function isDefaultLanguageCodename(value: string | undefined | null): value is DefaultLanguageCodename {
	return typeof value === 'string' && value === ('default' satisfies DefaultLanguageCodename);
}
