export const taxonomies = {
	/*
	 * taxonomy_a
	 */
	taxonomy_a: {
		name: 'Taxonomy A',
		codename: 'taxonomy_a',
		externalId: undefined,
		id: 'bb37a632-3f78-48f8-ba25-7fa806d41a3e',
		terms: {
			/*
			 * Term 1
			 */
			term_1: {
				name: 'Term 1',
				codename: 'term_1',
				id: '548654a0-da85-4831-b3e5-8d555566868d',
				externalId: undefined,
				terms: {
					/*
					 * Nested term 1
					 */
					nested_term_1: {
						name: 'Nested term 1',
						codename: 'nested_term_1',
						id: 'a7b82db1-9c20-4d27-963e-66510a397ae0',
						externalId: undefined,
						terms: {
							/*
							 * Nested term 2
							 */
							nested_term_2: {
								name: 'Nested term 2',
								codename: 'nested_term_2',
								id: '1f511bde-5b82-4d3c-afda-8570c6d19d9d',
								externalId: undefined,
								terms: {}
							}
						}
					}
				}
			},

			/*
			 * Term 2
			 */
			term_2: {
				name: 'Term 2',
				codename: 'term_2',
				id: '21be3ed9-10b8-435a-9820-09c1df84e6b3',
				externalId: undefined,
				terms: {}
			},

			/*
			 * Term 3
			 */
			term_3: {
				name: 'Term 3',
				codename: 'term_3',
				id: 'fa1e16a7-e0b1-4ac9-bdcb-9e8f6ef23593',
				externalId: undefined,
				terms: {}
			}
		}
	},

	/*
	 * taxonomy_without_terms
	 */
	taxonomy_without_terms: {
		name: 'Taxonomy without terms',
		codename: 'taxonomy_without_terms',
		externalId: undefined,
		id: '01878d46-fcbc-4211-a801-676ad4e72cb2',
		terms: {}
	}
} as const;
