import type { CoreItem } from '../system/index.ts';

/**
 * Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export type ContentTypeWithGuidelinesOnly = CoreItem<
    ContentTypeWithGuidelinesOnlyElementCodenames,
    Record<string, never>,
    'content_type_with_guidelines_only'
>;

/**
 * Type representing all available element codenames for Content type with guidelines only
 */
export type ContentTypeWithGuidelinesOnlyElementCodenames = never;

/**
 * Type guard for Content type with guidelines only
 *
 * Id: 7e38a995-b4d7-46c9-92a4-4359241fa5ef
 * Codename: content_type_with_guidelines_only
 */
export function isContentTypeWithGuidelinesOnlyItem(item: CoreItem | undefined | null): item is ContentTypeWithGuidelinesOnly {
    return item?.system?.type === 'content_type_with_guidelines_only';
}
