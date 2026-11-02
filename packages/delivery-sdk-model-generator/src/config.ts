export const deliveryConfig = {
	npmPackageName: "@kontent-ai/delivery-sdk",
	systemTypesFolderName: "system",
	mainSystemFilename: "main.system",
	typedItemTypeName: "TypedItem",
	typedDeliveryClientTypeName: "TypedDeliveryClient",
	typedClientSchemaTypeName: "TypedClientSchema",

	sdkTypes: {
		contentItemOf: "ContentItemOf",
		contentItemPayload: "ContentItemPayload",
		snippetOf: "SnippetOf",
		elements: "Elements",
		deliveryClient: "DeliveryClient",
		deliveryClientSchema: "DeliveryClientSchema",
	},
} as const;
