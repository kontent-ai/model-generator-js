import type { LanguageCodenames } from "./_languages.generated.js"

/*
 * Type representing codename of 'Spanish' language
 */
export type SpanishLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "es-ES">

/*
 * Typeguard for codename of 'Spanish' language
 */
export function isSpanishLanguageCodename(value: string | undefined | null): value is SpanishLanguageCodename {
	return typeof value === "string" && value === ("es-ES" satisfies SpanishLanguageCodename)
}
