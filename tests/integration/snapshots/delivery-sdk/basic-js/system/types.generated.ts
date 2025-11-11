import type { CircularReferenceTypeABType } from "../types/circular-reference-type-a-b-type.generated.js"
import type { CircularReferenceTypeBAType } from "../types/circular-reference-type-b-a-type.generated.js"
import type { ContentTypeWithAllElementsType } from "../types/content-type-with-all-elements-type.generated.js"
import type { ContentTypeWithGuidelinesOnlyType } from "../types/content-type-with-guidelines-only-type.generated.js"
import type { ContentTypeWithSnippetOnlyType } from "../types/content-type-with-snippet-only-type.generated.js"
import type { ContentTypeWithSpecialCharsType } from "../types/content-type-with-special-chars-type.generated.js"
import type { EmptyContentTypeType } from "../types/empty-content-type-type.generated.js"
import type { PageType } from "../types/page-type.generated.js"
import type { TypeReferencingDeletedTypeType } from "../types/type-referencing-deleted-type-type.generated.js"
import type { TypeWithEmptySnippetType } from "../types/type-with-empty-snippet-type.generated.js"
import type { WebSpotlightRootType } from "../types/web-spotlight-root-type.generated.js"

/*
 * Array of all type codenames
 */
export const typeCodenames = [
	"content_type_with_all_elements",
	"_content_type_with_special_chars____",
	"empty_content_type",
	"content_type_with_snippet_only",
	"content_type_with_guidelines_only",
	"circular_reference_type_a_b",
	"circular_reference_type_b____a",
	"web_spotlight_root",
	"page",
	"type_with_empty_snippet",
	"type_referencing_deleted_type"
] as const

/*
 * Type representing all type codenames
 */
export type TypeCodenames = (typeof typeCodenames)[number]

/*
 * Typeguard for type codename
 */
export function isTypeCodename(value: string | undefined | null): value is TypeCodenames {
	return typeof value === "string" && (typeCodenames as readonly string[]).includes(value)
}

/*
 * Core content type with narrowed types. Use this instead of'IContentItem' for increased type safety.
 */
export type CoreType =
	| ContentTypeWithAllElementsType
	| ContentTypeWithSpecialCharsType
	| EmptyContentTypeType
	| ContentTypeWithSnippetOnlyType
	| ContentTypeWithGuidelinesOnlyType
	| CircularReferenceTypeABType
	| CircularReferenceTypeBAType
	| WebSpotlightRootType
	| PageType
	| TypeWithEmptySnippetType
	| TypeReferencingDeletedTypeType

/*
 * Type mapping for codename & type. Can be used for type safe access to type based on the codename of type.
 */
export type CodenameTypeMapping = {
	readonly content_type_with_all_elements: ContentTypeWithAllElementsType
	readonly _content_type_with_special_chars____: ContentTypeWithSpecialCharsType
	readonly empty_content_type: EmptyContentTypeType
	readonly content_type_with_snippet_only: ContentTypeWithSnippetOnlyType
	readonly content_type_with_guidelines_only: ContentTypeWithGuidelinesOnlyType
	readonly circular_reference_type_a_b: CircularReferenceTypeABType
	readonly circular_reference_type_b____a: CircularReferenceTypeBAType
	readonly web_spotlight_root: WebSpotlightRootType
	readonly page: PageType
	readonly type_with_empty_snippet: TypeWithEmptySnippetType
	readonly type_referencing_deleted_type: TypeReferencingDeletedTypeType
}

/*
 * Helper type that returns type based on the codename of type.
 */
export type CodenameTypeMapper<TTypeCodename extends TypeCodenames> = TTypeCodename extends keyof CodenameTypeMapping
	? CodenameTypeMapping[TTypeCodename]
	: CoreType
