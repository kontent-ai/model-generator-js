
            
            /*
    * Array of all codenames
    *
    * Type: Language
    */
            export const languageCodenames = ['default', 'en-US', 'es-ES', '__jp', '🦉Lang'] as const;;
           
            /*
    * Type representing all codenames
    *
    * Type: Language
    */
            export type LanguageCodenames = typeof languageCodenames[number];

            /*
    * Typeguard for codename
    *
    * Type: Language
    */
            export function isLanguageCodename(value: string | undefined | null): value is LanguageCodenames {
                return typeof value === 'string' && (languageCodenames as readonly string[]).includes(value);
            };
            