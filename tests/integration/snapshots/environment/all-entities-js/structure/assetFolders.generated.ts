export const assetFolders = {
	/*
	 * Folder A
	 */
	folder_a: {
		name: "Folder A",
		codename: "folder_a",
		id: "5cf5c539-6574-4971-b4da-4cd503052f61",
		externalId: undefined,
		folders: {
			/*
			 * Folder C
			 */
			folder_c: {
				name: "Folder C",
				codename: "folder_c",
				id: "a829c87a-e627-4d80-af16-2f6c92509452",
				externalId: undefined,
				folders: {
					/*
					 * Folder D
					 */
					folder_d: {
						name: "Folder D",
						codename: "folder_d",
						id: "8e1edcd2-5b53-4228-aadb-2211ee3ea91e",
						externalId: undefined,
						folders: {}
					}
				}
			}
		}
	},

	/*
	 * Folder B
	 */
	folder_b: {
		name: "Folder B",
		codename: "folder_b",
		id: "916b6be8-55c3-4a45-80ad-8d860fd7d1f6",
		externalId: undefined,
		folders: {}
	}
} as const
