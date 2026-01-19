import type { LanguageCodenames } from "../system/languages.generated.js";

/*
 * Type representing codename of 'Default project language' language
 */
export type DefaultProjectLanguageLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "default">;

/*
 * Typeguard for codename of 'Default project language' language
 */
export function isDefaultProjectLanguageLanguageCodename(
	value: string | undefined | null,
): value is DefaultProjectLanguageLanguageCodename {
	return typeof value === "string" && value === ("default" satisfies DefaultProjectLanguageLanguageCodename);
}
