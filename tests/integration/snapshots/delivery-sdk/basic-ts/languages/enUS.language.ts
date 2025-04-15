import type { LanguageCodenames } from './_languages.ts';

/**
 * Type representing codename of English Language
 *
 * Codename: en-US
 */
export type EnglishLanguageCodename = Extract<LanguageCodenames, 'en-US'>;

/**
 * Type guard for English entity
 *
 * Codename: en-US
 */
export function isEnglishLanguageCodename(value: string | undefined | null): value is EnglishLanguageCodename {
    return typeof value === 'string' && value === ('en-US' satisfies EnglishLanguageCodename);
}
