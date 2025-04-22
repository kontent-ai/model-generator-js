import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Page
 *
 * Codename: page
 */
export type ContentType_pageContentTypeCodename = Extract<ContentTypeCodenames, 'page'>;

/*
 * Type guard for Page entity
 *
 * Codename: page
 */
export function isContentType_pageContentTypeCodename(value: string | undefined | null): value is ContentType_pageContentTypeCodename {
	return typeof value === 'string' && value === ('page' satisfies ContentType_pageContentTypeCodename);
}
