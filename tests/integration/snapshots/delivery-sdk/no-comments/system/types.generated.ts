import type { CircularReferenceTypeABItem } from "../types/circular-reference-type-a-b-type.generated.js";
import type { CircularReferenceTypeBAItem } from "../types/circular-reference-type-b-a-type.generated.js";
import type { ContentTypeWithAllElementsItem } from "../types/content-type-with-all-elements-type.generated.js";
import type { ContentTypeWithGuidelinesOnlyItem } from "../types/content-type-with-guidelines-only-type.generated.js";
import type { ContentTypeWithSnippetOnlyItem } from "../types/content-type-with-snippet-only-type.generated.js";
import type { ContentTypeWithSpecialCharsItem } from "../types/content-type-with-special-chars-type.generated.js";
import type { EmptyContentTypeItem } from "../types/empty-content-type-type.generated.js";
import type { PageItem } from "../types/page-type.generated.js";
import type { TypeReferencingDeletedTypeItem } from "../types/type-referencing-deleted-type-type.generated.js";
import type { TypeWithEmptySnippetItem } from "../types/type-with-empty-snippet-type.generated.js";
import type { WebSpotlightRootItem } from "../types/web-spotlight-root-type.generated.js";

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

export type TypeCodenames = (typeof typeCodenames)[number];

export function isTypeCodename(value: string | undefined | null): value is TypeCodenames {
	return typeof value === "string" && (typeCodenames as readonly string[]).includes(value);
}

export type CoreItem =
	| ContentTypeWithAllElementsItem
	| ContentTypeWithSpecialCharsItem
	| EmptyContentTypeItem
	| ContentTypeWithSnippetOnlyItem
	| ContentTypeWithGuidelinesOnlyItem
	| CircularReferenceTypeABItem
	| CircularReferenceTypeBAItem
	| WebSpotlightRootItem
	| PageItem
	| TypeWithEmptySnippetItem
	| TypeReferencingDeletedTypeItem;

export type TypeCodenameToItemMap = {
	readonly content_type_with_all_elements: ContentTypeWithAllElementsItem;
	readonly _content_type_with_special_chars____: ContentTypeWithSpecialCharsItem;
	readonly empty_content_type: EmptyContentTypeItem;
	readonly content_type_with_snippet_only: ContentTypeWithSnippetOnlyItem;
	readonly content_type_with_guidelines_only: ContentTypeWithGuidelinesOnlyItem;
	readonly circular_reference_type_a_b: CircularReferenceTypeABItem;
	readonly circular_reference_type_b____a: CircularReferenceTypeBAItem;
	readonly web_spotlight_root: WebSpotlightRootItem;
	readonly page: PageItem;
	readonly type_with_empty_snippet: TypeWithEmptySnippetItem;
	readonly type_referencing_deleted_type: TypeReferencingDeletedTypeItem;
};

export type TypeCodenameMapper<TTypeCodename extends TypeCodenames> = TTypeCodename extends keyof TypeCodenameToItemMap
	? TypeCodenameToItemMap[TTypeCodename]
	: CoreItem;
