
            import type { LanguageCodenames } from './_languages.js';
           
            /*
    * Type representing codename of entity
    *
    * Name: Spanish
* Codename: es-ES
* Type: Language
    */
            export type SpanishLanguageCodename = Extract<LanguageCodenames, 'es-ES'>;

            /*
    * Typeguard function for entity
    *
    * Name: Spanish
* Codename: es-ES
* Type: Language
    */
            export function isSpanishLanguageCodename(value: string | undefined | null): value is SpanishLanguageCodename {
                return typeof value === 'string' && value === ('es-ES' satisfies SpanishLanguageCodename);
            }
            