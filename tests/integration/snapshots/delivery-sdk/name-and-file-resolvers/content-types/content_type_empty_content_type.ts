import type { CoreContentType } from '../system/index.js';

/**
 * Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export type ContentType_empty_content_type = CoreContentType<
    ContentType_empty_content_typeElementCodenames,
    Record<string, never>,
    'empty_content_type'
>;

/**
 * Type representing all available element codenames for Empty content type
 */
export type ContentType_empty_content_typeElementCodenames = never;

/**
 * Type guard for Empty content type
 *
 * Id: 4e41e105-6ec5-4a08-9680-b85e9cd8b14e
 * Codename: empty_content_type
 */
export function isContentType_empty_content_type(item: CoreContentType | undefined | null): item is ContentType_empty_content_type {
    return item?.system?.type === 'empty_content_type';
}
