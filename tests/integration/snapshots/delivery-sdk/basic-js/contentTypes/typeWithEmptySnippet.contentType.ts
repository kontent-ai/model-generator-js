import type { ContentTypeCodenames } from './_contentTypes.js';

/**
 * Type representing codename of Type with empty snippet ContentType
 *
 * Codename: type_with_empty_snippet
 */
export type TypeWithEmptySnippetContentTypeCodename = Extract<ContentTypeCodenames, 'type_with_empty_snippet'>;

/**
 * Type guard for Type with empty snippet entity
 *
 * Codename: type_with_empty_snippet
 */
export function isTypeWithEmptySnippetContentTypeCodename(
    value: string | undefined | null
): value is TypeWithEmptySnippetContentTypeCodename {
    return typeof value === 'string' && value === ('type_with_empty_snippet' satisfies TypeWithEmptySnippetContentTypeCodename);
}
