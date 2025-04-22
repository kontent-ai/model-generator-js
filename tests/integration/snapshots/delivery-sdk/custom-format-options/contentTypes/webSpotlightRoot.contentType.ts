
            import type { ContentTypeCodenames } from './_contentTypes.js';
    
            /*
                * Type representing codename of Web spotlight root
                * 
                * Codename: web_spotlight_root
                */
            export type WebSpotlightRootContentTypeCodename = Extract<ContentTypeCodenames, 'web_spotlight_root'>;

            /*
                * Type guard for Web spotlight root entity
                * 
                * Codename: web_spotlight_root
            */
            export function isWebSpotlightRootContentTypeCodename(value: string | undefined | null): value is WebSpotlightRootContentTypeCodename {
                return typeof value === 'string' && value === ('web_spotlight_root' satisfies WebSpotlightRootContentTypeCodename);
            }
            
            