
import type { LanguageCodenames } from "../system/languages.generated.js";

export type EnglishLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "en">;

export function isEnglishLanguageCodename(value: string | undefined | null): value is EnglishLanguageCodename {
	return typeof value === "string" && value === ("en" satisfies EnglishLanguageCodename);
}
