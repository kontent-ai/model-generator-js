export const deliveryConfig = {
	npmPackageName: "@kontent-ai/delivery-sdk",
	systemTypesFolderName: "system",
	mainSystemFilename: "main.system",
	coreContentTypeName: "CoreItem",
	coreDeliveryClientTypeName: "CoreDeliveryClient",
	coreClientSchemaTypeName: "CoreClientSchema",

	sdkTypes: {
		contentItemOf: "ContentItemOf",
		contentItemPayload: "ContentItemPayload",
		snippetOf: "SnippetOf",
		elements: "Elements",
		deliveryClient: "DeliveryClient",
		deliveryClientSchema: "DeliveryClientSchema",
	},
} as const;
