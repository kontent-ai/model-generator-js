export const contentTypes = {
	/*
	 * Content type with all elements
	 */
	content_type_with_all_elements: {
		name: "Content type with all elements",
		codename: "content_type_with_all_elements",
		id: "071c7591-e7f0-41ac-984f-7a3db35f97e8",
		externalId: undefined,
		elements: {
			/*
			 * Text element
			 *
			 * Guidelines: Simple text element guidelines
			 */
			text_element: {
				name: "Text element",
				codename: "text_element",
				id: "cf24e550-3bbe-4e9d-aee6-e81b9b490228",
				externalId: undefined,
				required: true,
				type: "text",
			},

			/*
			 * Url slug element
			 */
			url_slug_element: {
				name: "Url slug element",
				codename: "url_slug_element",
				id: "e117d1ae-d985-4df2-b6c7-b3aa03521a00",
				externalId: undefined,
				required: false,
				type: "url_slug",
			},

			/*
			 * Rich text element
			 */
			rich_text_element: {
				name: "Rich text element",
				codename: "rich_text_element",
				id: "81ee0883-8c1b-49cc-8d11-2fd1dcf75c5c",
				externalId: undefined,
				required: false,
				type: "rich_text",
			},

			/*
			 * Date & time element
			 */
			date___time_element: {
				name: "Date & time element",
				codename: "date___time_element",
				id: "38d5d709-4152-445c-b1ef-333147bd656e",
				externalId: undefined,
				required: false,
				type: "date_time",
			},

			/*
			 * Custom element
			 */
			custom_element: {
				name: "Custom element",
				codename: "custom_element",
				id: "768581f2-7b56-4be3-a8a2-a1850dbe493e",
				externalId: undefined,
				required: false,
				type: "custom",
			},

			/*
			 * Linked items element
			 */
			linked_items_element: {
				name: "Linked items element",
				codename: "linked_items_element",
				id: "4631c94d-034c-428a-88bb-cae6d7985ff5",
				externalId: undefined,
				required: false,
				type: "modular_content",
			},

			/*
			 * Asset element
			 */
			asset_element: {
				name: "Asset element",
				codename: "asset_element",
				id: "fc99d625-106b-4f95-b37e-7f7be358d3d1",
				externalId: undefined,
				required: false,
				type: "asset",
			},

			/*
			 * Multiple choice element
			 */
			multiple_choice_element: {
				name: "Multiple choice element",
				codename: "multiple_choice_element",
				id: "709148dd-8c3f-4660-95b8-a72f386dd367",
				externalId: undefined,
				required: false,
				type: "multiple_choice",
				options: {
					/*
					 * Option A
					 */
					option_a: {
						name: "Option A",
						id: "c3f7bfdf-62d8-433b-a3e7-0909bbb28ce1",
						codename: "option_a",
						externalId: undefined,
					},

					/*
					 * Option B
					 */
					option_b: {
						name: "Option B",
						id: "66e1a3a8-25ae-4eb6-bbd8-0af6c77b432f",
						codename: "option_b",
						externalId: undefined,
					},
				},
			},

			/*
			 * Number element
			 */
			number_element: {
				name: "Number element",
				codename: "number_element",
				id: "7416ea32-3d33-45bb-bf2a-2226f658e953",
				externalId: undefined,
				required: false,
				type: "number",
			},

			/*
			 * Rich text with all allowed item types
			 */
			snippet_a__rich_text_with_all_allowed_item_types: {
				name: "Rich text with all allowed item types",
				codename: "snippet_a__rich_text_with_all_allowed_item_types",
				id: "72cdc4e7-dead-4baf-99bf-91d8fe62351f",
				externalId: undefined,
				required: false,
				type: "rich_text",
			},

			/*
			 * Linked items with specific types
			 */
			snippet_a__linked_items_with_specific_types: {
				name: "Linked items with specific types",
				codename: "snippet_a__linked_items_with_specific_types",
				id: "140130dc-84c1-455f-99ab-d31579cf90d1",
				externalId: undefined,
				required: false,
				type: "modular_content",
			},

			/*
			 * Text
			 */
			snippet_a__text: {
				name: "Text",
				codename: "snippet_a__text",
				id: "873e4a7a-e2ea-49a0-b88e-2ff7b6892f60",
				externalId: undefined,
				required: true,
				type: "text",
			},

			/*
			 * Taxonomy A
			 */
			taxonomy_element: {
				name: "Taxonomy A",
				codename: "taxonomy_element",
				id: "6073dec8-2489-479f-9916-abc055126e59",
				externalId: undefined,
				required: false,
				type: "taxonomy",
			},
		},
	},

	/*
	 * 🐧 Content type with special chars #!_'
	 */
	_content_type_with_special_chars____: {
		name: "🐧 Content type with special chars #!_",
		codename: "_content_type_with_special_chars____",
		id: "66bfcb40-edd7-4edf-8176-33517d0d6f80",
		externalId: undefined,
		elements: {
			/*
			 * 🦜Parrot_emoji
			 */
			parrot__: {
				name: "🦜Parrot_emoji",
				codename: "parrot__",
				id: "cafaa776-893d-4e8c-b460-9534ac2fe769",
				externalId: undefined,
				required: false,
				type: "text",
			},

			/*
			 * !!!_$NumberElem<>-%@&{}()/§'`?´=^*#~
			 */
			_____numberelem_____________________: {
				name: "!!!_$NumberElem<>-%@&{}()/§`?´=^*#~",
				codename: "_____numberelem_____________________",
				id: "3bb33958-71f3-4039-8594-5f0df9378dbb",
				externalId: undefined,
				required: false,
				type: "number",
			},
		},
	},

	/*
	 * Empty content type
	 */
	empty_content_type: {
		name: "Empty content type",
		codename: "empty_content_type",
		id: "4e41e105-6ec5-4a08-9680-b85e9cd8b14e",
		externalId: undefined,
		elements: {},
	},

	/*
	 * Content type with snippet only
	 */
	content_type_with_snippet_only: {
		name: "Content type with snippet only",
		codename: "content_type_with_snippet_only",
		id: "7fd86bef-8f30-4a02-a1c3-fb130f65e9b4",
		externalId: undefined,
		elements: {
			/*
			 * Rich text with all allowed item types
			 */
			snippet_a__rich_text_with_all_allowed_item_types: {
				name: "Rich text with all allowed item types",
				codename: "snippet_a__rich_text_with_all_allowed_item_types",
				id: "72cdc4e7-dead-4baf-99bf-91d8fe62351f",
				externalId: undefined,
				required: false,
				type: "rich_text",
			},

			/*
			 * Linked items with specific types
			 */
			snippet_a__linked_items_with_specific_types: {
				name: "Linked items with specific types",
				codename: "snippet_a__linked_items_with_specific_types",
				id: "140130dc-84c1-455f-99ab-d31579cf90d1",
				externalId: undefined,
				required: false,
				type: "modular_content",
			},

			/*
			 * Text
			 */
			snippet_a__text: {
				name: "Text",
				codename: "snippet_a__text",
				id: "873e4a7a-e2ea-49a0-b88e-2ff7b6892f60",
				externalId: undefined,
				required: true,
				type: "text",
			},
		},
	},

	/*
	 * Content type with guidelines only
	 */
	content_type_with_guidelines_only: {
		name: "Content type with guidelines only",
		codename: "content_type_with_guidelines_only",
		id: "7e38a995-b4d7-46c9-92a4-4359241fa5ef",
		externalId: undefined,
		elements: {},
	},

	/*
	 * Circular reference type A > B
	 */
	circular_reference_type_a_b: {
		name: "Circular reference type A > B",
		codename: "circular_reference_type_a_b",
		id: "a58680f7-0667-4a0e-8dc2-889233bdbf71",
		externalId: undefined,
		elements: {
			/*
			 * Items
			 */
			items: {
				name: "Items",
				codename: "items",
				id: "33ab92dd-e47d-45e2-a060-3b5df0754c24",
				externalId: undefined,
				required: false,
				type: "modular_content",
			},
		},
	},

	/*
	 * Circular reference type B -> A
	 */
	circular_reference_type_b____a: {
		name: "Circular reference type B -> A",
		codename: "circular_reference_type_b____a",
		id: "919bdcad-fe8e-4f56-9a63-346154b6f6e2",
		externalId: undefined,
		elements: {
			/*
			 * Items
			 */
			items: {
				name: "Items",
				codename: "items",
				id: "019714f7-8c50-492b-8e5c-f7c3d7e2529b",
				externalId: undefined,
				required: false,
				type: "modular_content",
			},
		},
	},

	/*
	 * Web spotlight root
	 */
	web_spotlight_root: {
		name: "Web spotlight root",
		codename: "web_spotlight_root",
		id: "7e8ca9f3-7f06-44d6-b9db-ae4905531365",
		externalId: undefined,
		elements: {
			/*
			 * Title
			 */
			title: {
				name: "Title",
				codename: "title",
				id: "e9d19fa4-4ad3-4b3f-998a-ca392651f7d0",
				externalId: undefined,
				required: false,
				type: "text",
			},

			/*
			 * Subpages
			 */
			subpages: {
				name: "Subpages",
				codename: "subpages",
				id: "e6702a6b-35b8-4a12-acca-1b1361fc926b",
				externalId: undefined,
				required: false,
				type: "subpages",
			},

			/*
			 * Content
			 */
			content: {
				name: "Content",
				codename: "content",
				id: "ad185ebb-c7ec-4b89-bf89-4b415b5e0ca8",
				externalId: undefined,
				required: false,
				type: "modular_content",
			},
		},
	},

	/*
	 * Page
	 */
	page: {
		name: "Page",
		codename: "page",
		id: "4db6e2c7-c25b-4896-a05d-d20206234c04",
		externalId: undefined,
		elements: {
			/*
			 * Title
			 */
			title: {
				name: "Title",
				codename: "title",
				id: "e9ad8c8f-6fb0-41d2-8caa-4e4e0ba24719",
				externalId: undefined,
				required: false,
				type: "text",
			},

			/*
			 * URL
			 */
			url: {
				name: "URL",
				codename: "url",
				id: "e573bfc9-3193-4224-9d2a-9efb83da8849",
				externalId: undefined,
				required: false,
				type: "url_slug",
			},

			/*
			 * Show in navigation
			 */
			show_in_navigation: {
				name: "Show in navigation",
				codename: "show_in_navigation",
				id: "07889917-fdc5-4285-bc30-4fed2a218c89",
				externalId: undefined,
				required: false,
				type: "multiple_choice",
				options: {
					/*
					 * Yes
					 */
					yes: {
						name: "Yes",
						id: "0878b011-be8d-4a1e-9fc8-d79c9d9176a2",
						codename: "yes",
						externalId: undefined,
					},

					/*
					 * No
					 */
					no: {
						name: "No",
						id: "ae8520bf-72b3-4677-99de-fc99d743019b",
						codename: "no",
						externalId: undefined,
					},
				},
			},

			/*
			 * Subpages
			 */
			subpages: {
				name: "Subpages",
				codename: "subpages",
				id: "b909dc5d-0efe-478a-9257-83e5c90e884d",
				externalId: undefined,
				required: false,
				type: "subpages",
			},

			/*
			 * Content
			 */
			content: {
				name: "Content",
				codename: "content",
				id: "dfb0d07c-531e-4eaa-8f7d-e62671d4ca36",
				externalId: undefined,
				required: false,
				type: "modular_content",
			},
		},
	},

	/*
	 * Type with empty snippet
	 */
	type_with_empty_snippet: {
		name: "Type with empty snippet",
		codename: "type_with_empty_snippet",
		id: "11039462-1d7d-4673-9aa8-af07fb53985c",
		externalId: undefined,
		elements: {},
	},

	/*
	 * Type referencing deleted type
	 */
	type_referencing_deleted_type: {
		name: "Type referencing deleted type",
		codename: "type_referencing_deleted_type",
		id: "f7562083-7230-4c20-9136-620ee7a92534",
		externalId: undefined,
		elements: {
			/*
			 * Rich text with invalid type
			 */
			rich_text_with_invalid_type: {
				name: "Rich text with invalid type",
				codename: "rich_text_with_invalid_type",
				id: "03df7457-fb30-4d4e-aee2-06b0e1f218a2",
				externalId: undefined,
				required: false,
				type: "rich_text",
			},

			/*
			 * Linked items with invalid type
			 */
			linked_items_with_invalid_type: {
				name: "Linked items with invalid type",
				codename: "linked_items_with_invalid_type",
				id: "cc310017-de8b-42f1-962b-63959367d29a",
				externalId: undefined,
				required: false,
				type: "modular_content",
			},
		},
	},
} as const;
