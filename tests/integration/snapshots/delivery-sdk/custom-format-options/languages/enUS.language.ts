
            import type { LanguageCodenames } from './_languages.js';
           
            /*
* Type representing codename of 'English' language
*/
            export type EnglishLanguageCodename = Extract<LanguageCodenames, 'en-US'>;

            /*
* Typeguard for codename of 'English' language
*/
            export function isEnglishLanguageCodename(value: string | undefined | null): value is EnglishLanguageCodename {
                return typeof value === 'string' && value === ('en-US' satisfies EnglishLanguageCodename);
            }
            