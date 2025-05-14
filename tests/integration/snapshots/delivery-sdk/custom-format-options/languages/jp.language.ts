
            import type { LanguageCodenames } from './_languages.js';
           
    
            /*
                * Type representing codename of __jp
                * 
                * Codename: __jp
                */
            export type JpLanguageCodename = Extract<LanguageCodenames, '__jp'>;

            /*
                * Type guard for __jp
                * 
                * Codename: __jp
            */
            export function isJpLanguageCodename(value: string | undefined | null): value is JpLanguageCodename {
                return typeof value === 'string' && value === ('__jp' satisfies JpLanguageCodename);
            }
            
            