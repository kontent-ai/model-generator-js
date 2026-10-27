import type { LanguageCodenames } from "../system/languages.generated.js";

export type DefaultProjectLanguageLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "default">;

export function isDefaultProjectLanguageLanguageCodename(
	value: string | undefined | null,
): value is DefaultProjectLanguageLanguageCodename {
	return typeof value === "string" && value === ("default" satisfies DefaultProjectLanguageLanguageCodename);
}
