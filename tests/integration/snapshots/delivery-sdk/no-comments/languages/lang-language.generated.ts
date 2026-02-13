import type { LanguageCodenames } from "../system/languages.generated.js";

export type LangLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "🦉Lang">;

export function isLangLanguageCodename(value: string | undefined | null): value is LangLanguageCodename {
	return typeof value === "string" && value === ("🦉Lang" satisfies LangLanguageCodename);
}
