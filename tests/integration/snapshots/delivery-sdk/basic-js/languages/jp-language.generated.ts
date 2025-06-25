import type { LanguageCodenames } from "../system/languages.generated.js"

/*
 * Type representing codename of '__jp' language
 */
export type JpLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "__jp">

/*
 * Typeguard for codename of '__jp' language
 */
export function isJpLanguageCodename(value: string | undefined | null): value is JpLanguageCodename {
	return typeof value === "string" && value === ("__jp" satisfies JpLanguageCodename)
}
