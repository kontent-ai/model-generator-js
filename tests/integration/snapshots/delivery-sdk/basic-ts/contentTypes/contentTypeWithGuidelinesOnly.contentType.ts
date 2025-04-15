import type { ContentTypeCodenames } from './_contentTypes.ts';

/**
 * Type representing codename of Content type with guidelines only ContentType
 *
 * Codename: content_type_with_guidelines_only
 */
export type ContentTypeWithGuidelinesOnlyContentTypeCodename = Extract<ContentTypeCodenames, 'content_type_with_guidelines_only'>;

/**
 * Type guard for Content type with guidelines only entity
 *
 * Codename: content_type_with_guidelines_only
 */
export function isContentTypeWithGuidelinesOnlyContentTypeCodename(
    value: string | undefined | null
): value is ContentTypeWithGuidelinesOnlyContentTypeCodename {
    return (
        typeof value === 'string' &&
        value === ('content_type_with_guidelines_only' satisfies ContentTypeWithGuidelinesOnlyContentTypeCodename)
    );
}
