import type { ContentTypeCircularReferenceTypeAB } from "../types/content-type-circular-reference-type-a-b.generated.js"
import type { ContentTypeCircularReferenceTypeBA } from "../types/content-type-circular-reference-type-b-a.generated.js"
import type { ContentTypeContentTypeWithAllElements } from "../types/content-type-content-type-with-all-elements.generated.js"
import type { ContentTypeContentTypeWithGuidelinesOnly } from "../types/content-type-content-type-with-guidelines-only.generated.js"
import type { ContentTypeContentTypeWithSnippetOnly } from "../types/content-type-content-type-with-snippet-only.generated.js"
import type { ContentTypeContentTypeWithSpecialChars } from "../types/content-type-content-type-with-special-chars.generated.js"
import type { ContentTypeEmptyContentType } from "../types/content-type-empty-content-type.generated.js"
import type { ContentTypePage } from "../types/content-type-page.generated.js"
import type { ContentTypeTypeReferencingDeletedType } from "../types/content-type-type-referencing-deleted-type.generated.js"
import type { ContentTypeTypeWithEmptySnippet } from "../types/content-type-type-with-empty-snippet.generated.js"
import type { ContentTypeWebSpotlightRoot } from "../types/content-type-web-spotlight-root.generated.js"

/*
 * Array of all type codenames
 */
export const typeCodenames = [
	"content_type_with_snippet_only",
	"_content_type_with_special_chars____",
	"circular_reference_type_a_b",
	"page",
	"content_type_with_all_elements",
	"content_type_with_guidelines_only",
	"circular_reference_type_b____a",
	"empty_content_type",
	"type_with_empty_snippet",
	"web_spotlight_root",
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
	| ContentTypeContentTypeWithSnippetOnly
	| ContentTypeContentTypeWithSpecialChars
	| ContentTypeCircularReferenceTypeAB
	| ContentTypePage
	| ContentTypeContentTypeWithAllElements
	| ContentTypeContentTypeWithGuidelinesOnly
	| ContentTypeCircularReferenceTypeBA
	| ContentTypeEmptyContentType
	| ContentTypeTypeWithEmptySnippet
	| ContentTypeWebSpotlightRoot
	| ContentTypeTypeReferencingDeletedType

/*
 * Type mapping for codename & type. Can be used for type safe access to type based on the codename of type.
 */
export type CodenameTypeMapping = {
	readonly content_type_with_snippet_only: ContentTypeContentTypeWithSnippetOnly
	readonly _content_type_with_special_chars____: ContentTypeContentTypeWithSpecialChars
	readonly circular_reference_type_a_b: ContentTypeCircularReferenceTypeAB
	readonly page: ContentTypePage
	readonly content_type_with_all_elements: ContentTypeContentTypeWithAllElements
	readonly content_type_with_guidelines_only: ContentTypeContentTypeWithGuidelinesOnly
	readonly circular_reference_type_b____a: ContentTypeCircularReferenceTypeBA
	readonly empty_content_type: ContentTypeEmptyContentType
	readonly type_with_empty_snippet: ContentTypeTypeWithEmptySnippet
	readonly web_spotlight_root: ContentTypeWebSpotlightRoot
	readonly type_referencing_deleted_type: ContentTypeTypeReferencingDeletedType
}

/*
 * Helper type that returns type based on the codename of type.
 */
export type CodenameTypeMapper<TTypeCodename extends TypeCodenames> = TTypeCodename extends keyof CodenameTypeMapping
	? CodenameTypeMapping[TTypeCodename]
	: CoreType
