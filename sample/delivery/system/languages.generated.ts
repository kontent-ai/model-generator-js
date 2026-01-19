
export const languageCodenames = ["en", "cz", "German"] as const;

export type LanguageCodenames = (typeof languageCodenames)[number];

export function isLanguageCodename(value: string | undefined | null): value is LanguageCodenames {
	return typeof value === "string" && (languageCodenames as readonly string[]).includes(value);
}
