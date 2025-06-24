
            import type { LanguageCodenames } from './_languages.generated.js';
           
            /*
* Type representing codename of 'Spanish' language
*/
            export type EsESLanguageCodename = keyof Pick<Record<LanguageCodenames, null>, "es-ES">;

            /*
* Typeguard for codename of 'Spanish' language
*/
            export function isEsESLanguageCodename(value: string | undefined | null): value is EsESLanguageCodename {
                return typeof value === 'string' && value === ('es-ES' satisfies EsESLanguageCodename);
            }
            