/*
 * Array of all language codenames
 */
export const languageCodenames = ['default', 'en-US', 'es-ES', '__jp', '🦉Lang'] as const;

/*
 * Type representing all language codenames
 */
export type LanguageCodenames = (typeof languageCodenames)[number];

/*
 * Typeguard for language codename
 */
export function isLanguageCodename(value: string | undefined | null): value is LanguageCodenames {
	return typeof value === 'string' && (languageCodenames as readonly string[]).includes(value);
}
