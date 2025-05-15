
            import type { LanguageCodenames } from './_languages.js';
           
    
            /*
                * Type representing codename of entity
                * 
                * Name: Default project language
        * Codename: default
        * Type: Language
                */
            export type DefaultProjectLanguageLanguageCodename = Extract<LanguageCodenames, 'default'>;

            /*
                * Type guard for Default project language
                * 
                * Name: Default project language
        * Codename: default
        * Type: Language
            */
            export function isDefaultProjectLanguageLanguageCodename(value: string | undefined | null): value is DefaultProjectLanguageLanguageCodename {
                return typeof value === 'string' && value === ('default' satisfies DefaultProjectLanguageLanguageCodename);
            }
            
            