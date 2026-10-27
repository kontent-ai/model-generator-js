import type { LanguageCodenames } from "../system/languages.generated.js";

/*
 * Type representing codename of '🦉Lang' language
 */
export type LangLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "🦉Lang">;

/*
 * Typeguard for codename of '🦉Lang' language
 */
export function isLangLanguageCodename(value: string | undefined | null): value is LangLanguageCodename {
	return typeof value === "string" && value === ("🦉Lang" satisfies LangLanguageCodename);
}
