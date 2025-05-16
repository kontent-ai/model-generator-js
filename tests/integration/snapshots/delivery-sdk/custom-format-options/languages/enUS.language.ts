
            import type { LanguageCodenames } from './_languages.js';
           
            /*
    * Type representing codename of entity
    *
    * Name: English
* Codename: en-US
* Type: Language
    */
            export type EnglishLanguageCodename = Extract<LanguageCodenames, 'en-US'>;

            /*
    * Typeguard function for entity
    *
    * Name: English
* Codename: en-US
* Type: Language
    */
            export function isEnglishLanguageCodename(value: string | undefined | null): value is EnglishLanguageCodename {
                return typeof value === 'string' && value === ('en-US' satisfies EnglishLanguageCodename);
            }
            