
            import type { ContentTypeCodenames } from './_contentTypes.js';
    
            /*
                * Type representing codename of Content type with all elements
                * 
                * Codename: content_type_with_all_elements
                */
            export type ContentTypeWithAllElementsContentTypeCodename = Extract<ContentTypeCodenames, 'content_type_with_all_elements'>;

            /*
                * Type guard for Content type with all elements entity
                * 
                * Codename: content_type_with_all_elements
            */
            export function isContentTypeWithAllElementsContentTypeCodename(value: string | undefined | null): value is ContentTypeWithAllElementsContentTypeCodename {
                return typeof value === 'string' && value === ('content_type_with_all_elements' satisfies ContentTypeWithAllElementsContentTypeCodename);
            }
            
            