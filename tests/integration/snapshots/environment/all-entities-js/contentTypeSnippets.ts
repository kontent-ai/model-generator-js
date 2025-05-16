export const contentTypeSnippets = {
	/*
	 * Snippet A
	 */
	snippet_a: {
		name: 'Snippet A',
		codename: 'snippet_a',
		id: 'b74eb5f6-c851-42f2-9fea-e367d0a3fa61',
		externalId: undefined,
		elements: {
			/*
			 * Rich text with all allowed item types
			 */
			snippet_a__rich_text_with_all_allowed_item_types: {
				name: 'Rich text with all allowed item types',
				codename: 'snippet_a__rich_text_with_all_allowed_item_types',
				id: '72cdc4e7-dead-4baf-99bf-91d8fe62351f',
				externalId: undefined,
				required: false,
				type: 'rich_text'
			},

			/*
			 * Linked items with specific types
			 */
			snippet_a__linked_items_with_specific_types: {
				name: 'Linked items with specific types',
				codename: 'snippet_a__linked_items_with_specific_types',
				id: '140130dc-84c1-455f-99ab-d31579cf90d1',
				externalId: undefined,
				required: false,
				type: 'modular_content'
			},

			/*
			 * Text
			 */
			snippet_a__text: {
				name: 'Text',
				codename: 'snippet_a__text',
				id: '873e4a7a-e2ea-49a0-b88e-2ff7b6892f60',
				externalId: undefined,
				required: true,
				type: 'text'
			}
		}
	},

	/*
	 * Empty snippet
	 */
	empty_snippet: {
		name: 'Empty snippet',
		codename: 'empty_snippet',
		id: '1d7e3745-3320-4107-996b-2c6b240df7ae',
		externalId: undefined,
		elements: {}
	}
} as const;
