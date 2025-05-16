
            import type { LanguageCodenames } from './_languages.js';
           
            /*
* Type representing codename of 'Default project language' language
*/
            export type DefaultProjectLanguageLanguageCodename = Extract<LanguageCodenames, 'default'>;

            /*
* Typeguard for codename of 'Default project language' language
*/
            export function isDefaultProjectLanguageLanguageCodename(value: string | undefined | null): value is DefaultProjectLanguageLanguageCodename {
                return typeof value === 'string' && value === ('default' satisfies DefaultProjectLanguageLanguageCodename);
            }
            