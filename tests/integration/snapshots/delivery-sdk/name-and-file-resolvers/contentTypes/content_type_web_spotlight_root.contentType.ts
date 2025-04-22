import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Web spotlight root
 *
 * Codename: web_spotlight_root
 */
export type ContentType_web_spotlight_rootContentTypeCodename = Extract<ContentTypeCodenames, 'web_spotlight_root'>;

/*
 * Type guard for Web spotlight root
 *
 * Codename: web_spotlight_root
 */
export function isContentType_web_spotlight_rootContentTypeCodename(
	value: string | undefined | null
): value is ContentType_web_spotlight_rootContentTypeCodename {
	return typeof value === 'string' && value === ('web_spotlight_root' satisfies ContentType_web_spotlight_rootContentTypeCodename);
}
