
import type { ContentTypeCodenames } from './_contentTypes.js';
    
 /**
 * Type representing codename of Page ContentType
 * 
* Codename: page
*/
export type PageContentTypeCodename = Extract<ContentTypeCodenames, 'page'>;

/**
 * Type guard for Page entity
 * 
* Codename: page
*/
export function isPageContentTypeCodename(value: string | undefined | null): value is PageContentTypeCodename {
                return typeof value === 'string' && value === ('page' satisfies PageContentTypeCodename);
            }

