
            import type { LanguageCodenames } from './_languages.js';
    
            /*
                * Type representing codename of Default project language
                * 
                * Codename: default
                */
            export type DefaultProjectLanguageLanguageCodename = Extract<LanguageCodenames, 'default'>;

            /*
                * Type guard for Default project language entity
                * 
                * Codename: default
            */
            export function isDefaultProjectLanguageLanguageCodename(value: string | undefined | null): value is DefaultProjectLanguageLanguageCodename {
                return typeof value === 'string' && value === ('default' satisfies DefaultProjectLanguageLanguageCodename);
            }
            
            