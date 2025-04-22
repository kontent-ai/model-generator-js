import type { ContentTypeCodenames } from './_contentTypes.ts';

/*
 * Type representing codename of Page
 *
 * Codename: page
 */
export type PageContentTypeCodename = Extract<ContentTypeCodenames, 'page'>;

/*
 * Type guard for Page entity
 *
 * Codename: page
 */
export function isPageContentTypeCodename(value: string | undefined | null): value is PageContentTypeCodename {
	return typeof value === 'string' && value === ('page' satisfies PageContentTypeCodename);
}
