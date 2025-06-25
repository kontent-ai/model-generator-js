
            import type { LanguageCodenames } from '../system/languages.generated.js';
           
            /*
* Type representing codename of 'English' language
*/
            export type EnglishLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "en-US">;

            /*
* Typeguard for codename of 'English' language
*/
            export function isEnglishLanguageCodename(value: string | undefined | null): value is EnglishLanguageCodename {
                return typeof value === 'string' && value === ('en-US' satisfies EnglishLanguageCodename);
            }
            