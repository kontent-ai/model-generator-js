export const previewUrls = {
	spaceDomains: {
		default_space: {
			spaceName: 'Default space',
			spaceCodename: 'default_space',
			domain: 'https://sample.com/A'
		},

		uk_space: {
			spaceName: 'UK Space',
			spaceCodename: 'uk_space',
			domain: 'https://sample.com/B'
		}
	},
	previewUrlPatterns: {
		content_type_with_all_elements: {
			contentTypeName: 'Content type with all elements',
			contentTypeCodename: 'content_type_with_all_elements',
			urlPatterns: {
				uk_space: {
					spaceName: 'UK Space',
					spaceCodename: 'uk_space',
					url: 'https://sample.com/{codename}'
				},

				default_space: {
					spaceName: 'Default space',
					spaceCodename: 'default_space',
					url: 'https://sample.com/default/{codename}'
				}
			}
		}
	}
} as const;
