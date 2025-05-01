export const workflows = {
	/*
	 * Default
	 */
	default: {
		name: 'Default',
		codename: 'default',
		id: '00000000-0000-0000-0000-000000000000',
		steps: {
			draft: {
				name: 'Draft',
				codename: 'draft',
				id: 'eee6db3b-545a-4785-8e86-e3772c8756f9'
			},
			scheduled: {
				name: 'Scheduled',
				codename: 'scheduled',
				id: '9d2b0228-4d0d-4c23-8b49-01a698857709'
			},
			published: {
				name: 'Published',
				codename: 'published',
				id: 'c199950d-99f0-4983-b711-6c4c91624b22'
			},
			archived: {
				name: 'Archived',
				codename: 'archived',
				id: '7a535a69-ad34-47f8-806a-def1fdf4d391'
			}
		}
	},

	/*
	 * Advanced workflow
	 */
	advanced_workflow: {
		name: 'Advanced workflow',
		codename: 'advanced_workflow',
		id: '7f29f522-6acc-4413-961f-822371e77757',
		steps: {
			draft_b42a7f1: {
				name: 'Draft',
				codename: 'draft_b42a7f1',
				id: 'b42a7f11-430c-4361-94f4-0292edad87f9'
			},
			step_1: {
				name: 'Step 1',
				codename: 'step_1',
				id: 'a75b9306-e81d-4aa7-b7cc-a3fdbcabdd5d'
			},
			step_2: {
				name: 'Step 2',
				codename: 'step_2',
				id: '08fa314a-420b-4045-bb80-c10ce0bae24d'
			},
			scheduled: {
				name: 'Scheduled',
				codename: 'scheduled',
				id: '9d2b0228-4d0d-4c23-8b49-01a698857709'
			},
			published: {
				name: 'Published',
				codename: 'published',
				id: 'c199950d-99f0-4983-b711-6c4c91624b22'
			},
			archived: {
				name: 'Archived',
				codename: 'archived',
				id: '7a535a69-ad34-47f8-806a-def1fdf4d391'
			}
		}
	}
} as const;
