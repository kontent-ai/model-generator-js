
import type { LanguageCodenames } from "../system/languages.generated.js";

export type GermanLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "German">;

export function isGermanLanguageCodename(value: string | undefined | null): value is GermanLanguageCodename {
	return typeof value === "string" && value === ("German" satisfies GermanLanguageCodename);
}
