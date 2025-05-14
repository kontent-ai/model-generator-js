
            import type { LanguageCodenames } from './_languages.js';
           
    
            /*
                * Type representing codename of Spanish
                * 
                * Codename: es-ES
                */
            export type SpanishLanguageCodename = Extract<LanguageCodenames, 'es-ES'>;

            /*
                * Type guard for Spanish
                * 
                * Codename: es-ES
            */
            export function isSpanishLanguageCodename(value: string | undefined | null): value is SpanishLanguageCodename {
                return typeof value === 'string' && value === ('es-ES' satisfies SpanishLanguageCodename);
            }
            
            