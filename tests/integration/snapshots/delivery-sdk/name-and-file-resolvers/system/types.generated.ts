import type { ContentTypeCircularReferenceTypeABItem } from "../types/content-type-circular-reference-type-a-b.generated.js";
import type { ContentTypeCircularReferenceTypeBAItem } from "../types/content-type-circular-reference-type-b-a.generated.js";
import type { ContentTypeContentTypeWithAllElementsItem } from "../types/content-type-content-type-with-all-elements.generated.js";
import type { ContentTypeContentTypeWithGuidelinesOnlyItem } from "../types/content-type-content-type-with-guidelines-only.generated.js";
import type { ContentTypeContentTypeWithSnippetOnlyItem } from "../types/content-type-content-type-with-snippet-only.generated.js";
import type { ContentTypeContentTypeWithSpecialCharsItem } from "../types/content-type-content-type-with-special-chars.generated.js";
import type { ContentTypeEmptyContentTypeItem } from "../types/content-type-empty-content-type.generated.js";
import type { ContentTypePageItem } from "../types/content-type-page.generated.js";
import type { ContentTypeTypeReferencingDeletedTypeItem } from "../types/content-type-type-referencing-deleted-type.generated.js";
import type { ContentTypeTypeWithEmptySnippetItem } from "../types/content-type-type-with-empty-snippet.generated.js";
import type { ContentTypeWebSpotlightRootItem } from "../types/content-type-web-spotlight-root.generated.js";

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
	"type_referencing_deleted_type",
] as const;

/*
 * Type representing all type codenames
 */
export type TypeCodenames = (typeof typeCodenames)[number];

/*
 * Typeguard for type codename
 */
export function isTypeCodename(value: string | undefined | null): value is TypeCodenames {
	return typeof value === "string" && (typeCodenames as readonly string[]).includes(value);
}

/*
 * Core content type with narrowed types. Use this instead of 'ContentItemPayload' for increased type safety.
 */
export type CoreItem =
	| ContentTypeContentTypeWithAllElementsItem
	| ContentTypeContentTypeWithSpecialCharsItem
	| ContentTypeEmptyContentTypeItem
	| ContentTypeContentTypeWithSnippetOnlyItem
	| ContentTypeContentTypeWithGuidelinesOnlyItem
	| ContentTypeCircularReferenceTypeABItem
	| ContentTypeCircularReferenceTypeBAItem
	| ContentTypeWebSpotlightRootItem
	| ContentTypePageItem
	| ContentTypeTypeWithEmptySnippetItem
	| ContentTypeTypeReferencingDeletedTypeItem;

/*
 * Type mapping for codename & type. Can be used for type safe access to type based on the codename of type.
 */
export type TypeCodenameToItemMap = {
	readonly content_type_with_all_elements: ContentTypeContentTypeWithAllElementsItem;
	readonly _content_type_with_special_chars____: ContentTypeContentTypeWithSpecialCharsItem;
	readonly empty_content_type: ContentTypeEmptyContentTypeItem;
	readonly content_type_with_snippet_only: ContentTypeContentTypeWithSnippetOnlyItem;
	readonly content_type_with_guidelines_only: ContentTypeContentTypeWithGuidelinesOnlyItem;
	readonly circular_reference_type_a_b: ContentTypeCircularReferenceTypeABItem;
	readonly circular_reference_type_b____a: ContentTypeCircularReferenceTypeBAItem;
	readonly web_spotlight_root: ContentTypeWebSpotlightRootItem;
	readonly page: ContentTypePageItem;
	readonly type_with_empty_snippet: ContentTypeTypeWithEmptySnippetItem;
	readonly type_referencing_deleted_type: ContentTypeTypeReferencingDeletedTypeItem;
};

/*
 * Helper type that returns type based on the codename of type.
 */
export type TypeCodenameMapper<TTypeCodename extends TypeCodenames> = TTypeCodename extends keyof TypeCodenameToItemMap
	? TypeCodenameToItemMap[TTypeCodename]
	: CoreItem;
