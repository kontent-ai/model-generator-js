import type { LanguageCodenames } from "../system/languages.generated.js";

export type JpLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "__jp">;

export function isJpLanguageCodename(value: string | undefined | null): value is JpLanguageCodename {
	return typeof value === "string" && value === ("__jp" satisfies JpLanguageCodename);
}
