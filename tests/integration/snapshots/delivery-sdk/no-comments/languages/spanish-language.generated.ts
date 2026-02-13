import type { LanguageCodenames } from "../system/languages.generated.js";

export type SpanishLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "es-ES">;

export function isSpanishLanguageCodename(value: string | undefined | null): value is SpanishLanguageCodename {
	return typeof value === "string" && value === ("es-ES" satisfies SpanishLanguageCodename);
}
