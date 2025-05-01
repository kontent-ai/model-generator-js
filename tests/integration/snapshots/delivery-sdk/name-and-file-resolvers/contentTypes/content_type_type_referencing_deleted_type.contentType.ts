import type { ContentTypeCodenames } from './_contentTypes.js';

/*
 * Type representing codename of Type referencing deleted type
 *
 * Codename: type_referencing_deleted_type
 */
export type ContentType_type_referencing_deleted_typeContentTypeCodename = Extract<ContentTypeCodenames, 'type_referencing_deleted_type'>;

/*
 * Type guard for Type referencing deleted type
 *
 * Codename: type_referencing_deleted_type
 */
export function isContentType_type_referencing_deleted_typeContentTypeCodename(
	value: string | undefined | null
): value is ContentType_type_referencing_deleted_typeContentTypeCodename {
	return (
		typeof value === 'string' &&
		value === ('type_referencing_deleted_type' satisfies ContentType_type_referencing_deleted_typeContentTypeCodename)
	);
}
