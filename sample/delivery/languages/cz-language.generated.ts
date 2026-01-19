
import type { LanguageCodenames } from "../system/languages.generated.js";

export type CzLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "cz">;

export function isCzLanguageCodename(value: string | undefined | null): value is CzLanguageCodename {
	return typeof value === "string" && value === ("cz" satisfies CzLanguageCodename);
}
