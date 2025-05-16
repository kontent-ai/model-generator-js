
            import type { LanguageCodenames } from './_languages.js';
           
            /*
* Type representing codename of 'Spanish' language
*/
            export type SpanishLanguageCodename = Extract<LanguageCodenames, 'es-ES'>;

            /*
* Typeguard for codename of 'Spanish' language
*/
            export function isSpanishLanguageCodename(value: string | undefined | null): value is SpanishLanguageCodename {
                return typeof value === 'string' && value === ('es-ES' satisfies SpanishLanguageCodename);
            }
            