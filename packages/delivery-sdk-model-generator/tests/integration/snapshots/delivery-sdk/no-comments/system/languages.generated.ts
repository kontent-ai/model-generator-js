export const languageCodenames = ["default", "en-US", "es-ES", "__jp", "🦉Lang"] as const;

export type LanguageCodenames = (typeof languageCodenames)[number];

export function isLanguageCodename(value: string | undefined | null): value is LanguageCodenames {
	return typeof value === "string" && (languageCodenames as readonly string[]).includes(value);
}
