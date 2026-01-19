import type { Elements, Snippet } from "@kontent-ai/delivery-sdk";
import type { SnippetCodenames } from "../system/snippets.generated.js";
import type { CoreType } from "../system/types.generated.js";
import type { ContentTypeWithAllElementsType } from "../types/content-type-with-all-elements-type.generated.js";

export type SnippetASnippetCodename = keyof Pick<Record<SnippetCodenames, null>, "snippet_a">;

export function isSnippetASnippetCodename(value: string | undefined | null): value is SnippetASnippetCodename {
	return typeof value === "string" && value === ("snippet_a" satisfies SnippetASnippetCodename);
}

export type SnippetASnippet = Snippet<
	SnippetASnippetElementCodenames,
	{
		readonly snippet_a__rich_text_with_all_allowed_item_types: Elements.RichTextElement<CoreType>;

		readonly snippet_a__linked_items_with_specific_types: Elements.LinkedItemsElement<ContentTypeWithAllElementsType>;

		readonly snippet_a__text: Elements.TextElement;
	}
>;

export type SnippetASnippetElementCodenames =
	| "snippet_a__rich_text_with_all_allowed_item_types"
	| "snippet_a__linked_items_with_specific_types"
	| "snippet_a__text";
