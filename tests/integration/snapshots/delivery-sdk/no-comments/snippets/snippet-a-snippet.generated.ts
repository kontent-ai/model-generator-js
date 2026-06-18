import type { ContentItemPayload, Elements, SnippetOf } from "@kontent-ai/delivery-sdk";
import type { CoreClientSchema } from "../system/main.system.generated.js";
import type { CoreType } from "../system/types.generated.js";
import type { ContentTypeWithAllElementsType, ContentTypeWithAllElementsTypeCodename } from "../types/content-type-with-all-elements-type.generated.js";
import type { ContentTypeWithSnippetOnlyTypeCodename } from "../types/content-type-with-snippet-only-type.generated.js";

export type SnippetASnippet = SnippetOf<
	CoreClientSchema,
	ContentTypeWithAllElementsTypeCodename | ContentTypeWithSnippetOnlyTypeCodename,
	{
		readonly snippet_a__rich_text_with_all_allowed_item_types: Elements.RichText<CoreType>;

		readonly snippet_a__linked_items_with_specific_types: Elements.LinkedItems<ContentTypeWithAllElementsType>;

		readonly snippet_a__text: Elements.Text;
	}
>;

export type SnippetASnippetElementCodenames =
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text";

export function isSnippetASnippet(item: ContentItemPayload<CoreClientSchema> | undefined | null): item is SnippetASnippet {
	return !!item && (["content_type_with_all_elements", "content_type_with_snippet_only"] as readonly string[]).includes(item.system.type);
}
