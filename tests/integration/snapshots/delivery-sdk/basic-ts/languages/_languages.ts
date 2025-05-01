/*
 * Object with all values of Language codenames
 */
export const languageCodenames = ['default', 'en-US', 'es-ES', '__jp', '🦉Lang'] as const;

/*
 * Type representing Language codenames
 */
export type LanguageCodenames = (typeof languageCodenames)[number];

/*
 * Type guard for Language codenames
 */
export function isLanguageCodename(value: string | undefined | null): value is LanguageCodenames {
	return typeof value === 'string' && (languageCodenames as readonly string[]).includes(value);
}
