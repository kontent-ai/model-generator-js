
            import type { ContentTypeCodenames } from './_contentTypes.js';
    
            /*
                * Type representing codename of Empty content type
                * 
                * Codename: empty_content_type
                */
            export type EmptyContentTypeContentTypeCodename = Extract<ContentTypeCodenames, 'empty_content_type'>;

            /*
                * Type guard for Empty content type
                * 
                * Codename: empty_content_type
            */
            export function isEmptyContentTypeContentTypeCodename(value: string | undefined | null): value is EmptyContentTypeContentTypeCodename {
                return typeof value === 'string' && value === ('empty_content_type' satisfies EmptyContentTypeContentTypeCodename);
            }
            
            