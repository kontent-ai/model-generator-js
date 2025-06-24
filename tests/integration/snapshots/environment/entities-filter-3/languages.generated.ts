export const languages = {
	/*
	 * Default project language
	 */
	default: {
		name: "Default project language",
		codename: "default",
		id: "00000000-0000-0000-0000-000000000000",
		isActive: true,
		isDefault: true,
		fallbackLanguageId: "00000000-0000-0000-0000-000000000000",
		externalId: undefined
	},

	/*
	 * English
	 */
	enUS: {
		name: "English",
		codename: "en-US",
		id: "92b3da35-4f76-4169-be83-dd6ea3e19df4",
		isActive: true,
		isDefault: false,
		fallbackLanguageId: "00000000-0000-0000-0000-000000000000",
		externalId: undefined
	},

	/*
	 * Spanish
	 */
	esES: {
		name: "Spanish",
		codename: "es-ES",
		id: "479cc04e-3cb9-4e4d-962e-8335edb0d42d",
		isActive: true,
		isDefault: false,
		fallbackLanguageId: "00000000-0000-0000-0000-000000000000",
		externalId: undefined
	},

	/*
	 * __jp
	 */
	jp: {
		name: "__jp",
		codename: "__jp",
		id: "012f5a8a-cd02-4dc0-8967-5fc015cb3ea8",
		isActive: true,
		isDefault: false,
		fallbackLanguageId: "00000000-0000-0000-0000-000000000000",
		externalId: undefined
	},

	/*
	 * 🦉Lang
	 */
	lang: {
		name: "🦉Lang",
		codename: "🦉Lang",
		id: "ca74c0e9-be0b-44e9-9d3c-dc2be224df34",
		isActive: true,
		isDefault: false,
		fallbackLanguageId: "00000000-0000-0000-0000-000000000000",
		externalId: undefined
	}
} as const
