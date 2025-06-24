import type { LanguageCodenames } from "./_languages.generated.js"

/*
 * Type representing codename of 'English' language
 */
export type EnUSLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "en-US">

/*
 * Typeguard for codename of 'English' language
 */
export function isEnUSLanguageCodename(value: string | undefined | null): value is EnUSLanguageCodename {
	return typeof value === "string" && value === ("en-US" satisfies EnUSLanguageCodename)
}
