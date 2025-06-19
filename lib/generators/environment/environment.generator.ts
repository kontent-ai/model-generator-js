import type {
	AssetFolderModels,
	CollectionModels,
	ContentTypeElements,
	ContentTypeModels,
	ContentTypeSnippetModels,
	CustomAppModels,
	EnvironmentModels,
	LanguageModels,
	PreviewModels,
	RoleModels,
	SpaceModels,
	TaxonomyModels,
	WebhookModels,
	WorkflowModels,
} from "@kontent-ai/management-sdk";
import { match } from "ts-pattern";
import { toGuidelinesComment, wrapComment } from "../../core/comment.utils.js";
import type { EnvironmentEntity, FlattenedElement, GeneratedFile, GeneratedSet, ValidateKeys } from "../../core/core.models.js";
import { findRequired, getStringOrUndefinedAsPropertyValue, isNotUndefined, toSafePropertyValue } from "../../core/core.utils.js";
import { getFlattenedElements } from "../../core/element.utils.js";
import { resolvePropertyName } from "../../core/resolvers.js";

type WorkflowStep = {
	readonly name: string;
	readonly codename: string;
	readonly id: string;
};

export type EnvironmentEntities = ValidateKeys<
	EnvironmentEntity,
	{
		readonly contentTypes: readonly Readonly<ContentTypeModels.ContentType>[] | undefined;
		readonly languages: readonly Readonly<LanguageModels.LanguageModel>[] | undefined;
		readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[] | undefined;
		readonly workflows: readonly Readonly<WorkflowModels.Workflow>[] | undefined;
		readonly assetFolders: readonly Readonly<AssetFolderModels.AssetFolder>[] | undefined;
		readonly collections: readonly Readonly<CollectionModels.Collection>[] | undefined;
		readonly roles: readonly Readonly<RoleModels.Role>[] | undefined;
		readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[] | undefined;
		readonly webhooks: readonly Readonly<WebhookModels.Webhook>[] | undefined;
		readonly customApps: readonly Readonly<CustomAppModels.CustomApp>[] | undefined;
		readonly spaces: readonly Readonly<SpaceModels.Space>[] | undefined;
		readonly previewUrls: Readonly<PreviewModels.PreviewConfiguration> | undefined;
	}
>;

export type EnvironmentGeneratorConfig = {
	readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
	readonly environmentEntities: EnvironmentEntities;
	readonly entitiesToCreate: readonly EnvironmentEntity[];
};

export function getEnvironmentGenerator(config: EnvironmentGeneratorConfig) {
	const generateEnvironmentModels = (): GeneratedSet => {
		return {
			folderName: undefined,
			files: [
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "languages",
					filename: "languages.ts",
					exportedConstName: "languages",
					entities: config.environmentEntities.languages,
					getCode: getLanguages,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "collections",
					filename: "collections.ts",
					exportedConstName: "collections",
					entities: config.environmentEntities.collections,
					getCode: getCollections,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "contentTypes",
					filename: "contentTypes.ts",
					exportedConstName: "contentTypes",
					entities: config.environmentEntities.contentTypes,
					getCode: getContentTypes,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "snippets",
					filename: "contentTypeSnippets.ts",
					exportedConstName: "contentTypeSnippets",
					entities: config.environmentEntities.snippets,
					getCode: getSnippets,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "workflows",
					filename: "workflows.ts",
					exportedConstName: "workflows",
					entities: config.environmentEntities.workflows,
					getCode: getWorkflows,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "roles",
					filename: "roles.ts",
					exportedConstName: "roles",
					entities: config.environmentEntities.roles,
					getCode: getRoles,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "assetFolders",
					filename: "assetFolders.ts",
					exportedConstName: "assetFolders",
					entities: config.environmentEntities.assetFolders,
					getCode: getAssetFolders,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "webhooks",
					filename: "webhooks.ts",
					exportedConstName: "webhooks",
					entities: config.environmentEntities.webhooks,
					getCode: getWebhooks,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "taxonomies",
					filename: "taxonomies.ts",
					exportedConstName: "taxonomies",
					entities: config.environmentEntities.taxonomies,
					getCode: getTaxonomies,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "customApps",
					filename: "customApps.ts",
					exportedConstName: "customApps",
					entities: config.environmentEntities.customApps,
					getCode: getCustomApps,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "spaces",
					filename: "spaces.ts",
					exportedConstName: "spaces",
					entities: config.environmentEntities.spaces,
					getCode: getSpaces,
				}),
				getEntityFile({
					entitiesToCreate: config.entitiesToCreate,
					entitiesProp: "previewUrls",
					filename: "previewUrls.ts",
					exportedConstName: "previewUrls",
					entities: config.environmentEntities.previewUrls,
					getCode: getPreviewUrls,
				}),
			].filter(isNotUndefined),
		};
	};

	const getEntityFile = <TProp extends keyof EnvironmentEntities>({
		entities,
		getCode,
		filename,
		entitiesToCreate,
		exportedConstName,
		entitiesProp,
	}: {
		readonly entitiesToCreate: readonly EnvironmentEntity[];
		readonly entitiesProp: TProp;
		readonly filename: string;
		readonly exportedConstName: string;
		readonly entities: EnvironmentEntities[TProp];
		readonly getCode: (entities: NonNullable<EnvironmentEntities[TProp]>) => string;
	}): GeneratedFile | undefined => {
		if (!(entities && entitiesToCreate.includes(entitiesProp))) {
			return undefined;
		}

		return {
			filename: filename,
			text: wrapInConst({ constName: exportedConstName, text: getCode(entities) }),
		};
	};

	const getLanguages = (languages: readonly Readonly<LanguageModels.LanguageModel>[]): string => {
		return languages.reduce((code, language, index) => {
			const isLast = index === languages.length - 1;

			return `${code}\n
                ${wrapComment(language.name)}
                ${resolvePropertyName(language.codename)}: {
                    name: '${toSafePropertyValue(language.name)}',
                    codename: '${language.codename}',
                    id: '${language.id}',
                    isActive: ${language.isActive ? "true" : "false"},
                    isDefault: ${language.isDefault ? "true" : "false"},
                    fallbackLanguageId: ${getStringOrUndefinedAsPropertyValue(language.fallbackLanguage?.id)},
                    externalId: ${getStringOrUndefinedAsPropertyValue(language.externalId)},
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getWorkflows = (workflows: readonly Readonly<WorkflowModels.Workflow>[]): string => {
		return workflows.reduce((code, workflow, index) => {
			const isLast = index === workflows.length - 1;

			return `${code}\n
                ${wrapComment(workflow.name)}
                ${workflow.codename}: {
                    name: '${toSafePropertyValue(workflow.name)}',
                    codename: '${workflow.codename}',
                    id: '${workflow.id}',
                    steps: ${getWorkflowSteps(workflow)}
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getCustomApps = (customApps: readonly Readonly<CustomAppModels.CustomApp>[]): string => {
		return customApps.reduce((code, customApp, index) => {
			const isLast = index === customApps.length - 1;

			return `${code}\n
                ${wrapComment(customApp.name)}
                ${resolvePropertyName(customApp.codename)}: {
                    name: '${toSafePropertyValue(customApp.name)}',
                    codename: '${customApp.codename}',
                    sourceUrl: '${customApp.source_url}'
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getSpaces = (spaces: readonly Readonly<SpaceModels.Space>[]): string => {
		return spaces.reduce((code, space, index) => {
			const isLast = index === spaces.length - 1;

			return `${code}\n
                ${wrapComment(space.name)}
                ${resolvePropertyName(space.codename)}: {
                    name: '${toSafePropertyValue(space.name)}',
                    codename: '${space.codename}',
                    id: '${space.id}'
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getPreviewUrls = (previewConfiguration: Readonly<PreviewModels.PreviewConfiguration>): string => {
		const spaces = config.environmentEntities.spaces;
		const contentTypes = config.environmentEntities.contentTypes;

		if (!spaces) {
			throw new Error("Spaces are expected to be present in the environment entities.");
		}

		if (!contentTypes) {
			throw new Error("Content types are expected to be present in the environment entities.");
		}

		return `
            spaceDomains: { ${previewConfiguration.spaceDomains.reduce((code, spaceDomain, index) => {
				const isLast = index === previewConfiguration.spaceDomains.length - 1;
				const space = findRequired(
					spaces,
					(m) => m.id === spaceDomain.space.id,
					`Space with id '${spaceDomain.space.id}' not found.`,
				);

				return `${code}\n
                ${space.codename}: {
                    spaceName: '${toSafePropertyValue(space.name)}',
                    spaceCodename: '${space.codename}',
                    domain: '${spaceDomain.domain}'
                }${!isLast ? ",\n" : ""}`;
			}, "")} },
              previewUrlPatterns: { ${previewConfiguration.previewUrlPatterns.reduce((code, previewUrlPattern, index) => {
					const isLast = index === previewConfiguration.previewUrlPatterns.length - 1;
					const contentType = findRequired(
						contentTypes,
						(m) => m.id === previewUrlPattern.contentType.id,
						`Content type with id '${previewUrlPattern.contentType.id}' not found.`,
					);

					return `${code}\n
                ${contentType.codename}: {
                    contentTypeName: '${toSafePropertyValue(contentType.name)}',
                    contentTypeCodename: '${contentType.codename}',
                    urlPatterns: { ${previewUrlPattern.urlPatterns.reduce((code, urlPattern, index) => {
						const isLast = index === previewUrlPattern.urlPatterns.length - 1;
						const space = config.environmentEntities.spaces?.find((m) => m.id === urlPattern.space?.id);

						return `${code}\n
                ${space?.codename ?? "default"}: {
                    spaceName: ${getStringOrUndefinedAsPropertyValue(space?.name)},
                    spaceCodename: ${getStringOrUndefinedAsPropertyValue(space?.codename)},
                    url: '${urlPattern.urlPattern}',
                        }${!isLast ? ",\n" : ""}`;
					}, "")} }
                }${!isLast ? ",\n" : ""}`;
				}, "")} }
        `;
	};

	const getAssetFolders = (assetFolders: readonly Readonly<AssetFolderModels.AssetFolder>[], isFirstLevel = true): string => {
		return (
			assetFolders.reduce(
				(code, assetFolder, index) => {
					const isLast = index === assetFolders.length - 1;

					return `${code}\n
                ${wrapComment(assetFolder.name)}
                ${assetFolder.codename}: {
                    name: '${toSafePropertyValue(assetFolder.name)}',
                    codename: '${assetFolder.codename}',
                    id: '${assetFolder.id}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(assetFolder.externalId)},
                    folders: ${getAssetFolders(assetFolder.folders, false)}}${!isLast ? ",\n" : ""}`;
				},
				!isFirstLevel ? "{" : "",
			) + (!isFirstLevel ? "}" : "")
		);
	};

	const getSnippets = (snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]): string => {
		return snippets.reduce((code, snippet, index) => {
			const isLast = index === snippets.length - 1;

			return `${code}\n
                ${wrapComment(snippet.name)}
                ${snippet.codename}: {
                    name: '${toSafePropertyValue(snippet.name)}',
                    codename: '${snippet.codename}',
                    id: '${snippet.id}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(snippet.externalId)},
                    elements: {${getContentTypeElements(snippet.elements)}}
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getContentTypes = (contentTypes: readonly Readonly<ContentTypeModels.ContentType>[]): string => {
		return contentTypes.reduce((code, contentType, index) => {
			const isLast = index === contentTypes.length - 1;

			return `${code}\n
                ${wrapComment(contentType.name)}
                ${contentType.codename}: {
                    name: '${toSafePropertyValue(contentType.name)}',
                    codename: '${contentType.codename}',
                    id: '${contentType.id}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(contentType.externalId)},
                    elements: {${getContentTypeElements(contentType.elements)}}
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getContentTypeElements = (elements: readonly Readonly<ContentTypeElements.ContentTypeElementModel>[]): string => {
		if (!config.environmentEntities.snippets) {
			throw new Error("Snippets are expected to be present in the environment entities.");
		}
		if (!config.environmentEntities.taxonomies) {
			throw new Error("Taxonomies are expected to be present in the environment entities.");
		}
		if (!config.environmentEntities.contentTypes) {
			throw new Error("Content types are expected to be present in the environment entities.");
		}

		const flattenedElements = getFlattenedElements({
			elements: elements,
			snippets: config.environmentEntities.snippets,
			taxonomies: config.environmentEntities.taxonomies,
			types: config.environmentEntities.contentTypes,
		});

		return flattenedElements.reduce((code, element, index) => {
			const isLast = index === flattenedElements.length - 1;
			const elementOptions = getElementOptionsCode(element);

			return `${code}
                ${wrapComment(element.title, {
					lines: [
						{
							name: "Guidelines",
							value: element.guidelines ? toGuidelinesComment(element.guidelines) : undefined,
						},
					],
				})}
                ${element.codename}: {
                    name: '${toSafePropertyValue(element.title)}',
                    codename: '${element.codename}',
                    id: '${element.id}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(element.externalId)},
                    required: ${element.isRequired},
                    type: '${element.type}'
                    ${elementOptions ? `, options: ${elementOptions}` : ""}
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getElementOptionsCode = (flattenedElement: FlattenedElement): string | undefined => {
		return match(flattenedElement.originalElement)
			.returnType<string | undefined>()
			.with({ type: "multiple_choice" }, (element) => {
				return `${element.options.reduce<string>((code, option, index) => {
					const isLast = index === element.options.length - 1;
					return `${code}\n
                ${wrapComment(option.name)}
                ${option.codename ? option.codename : resolvePropertyName(option.name)}: {
                    name: '${toSafePropertyValue(option.name)}',
                    id: '${option.id}',
                    codename: ${getStringOrUndefinedAsPropertyValue(option.codename)},
                    externalId: ${getStringOrUndefinedAsPropertyValue(option.external_id)}
                }${!isLast ? ",\n" : ""}`;
				}, "{")}}`;
			})
			.otherwise(() => undefined);
	};

	const getTaxonomies = (taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]): string => {
		return taxonomies.reduce((code, taxonomy, index) => {
			const isLast = index === taxonomies.length - 1;

			return `${code}\n
                 ${wrapComment(taxonomy.name)}
                 ${taxonomy.codename}: {
                    name: '${toSafePropertyValue(taxonomy.name)}',
                    codename: '${taxonomy.codename}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(taxonomy.externalId)},
                    id: '${taxonomy.id}',
                    ${getTaxonomyTerms(taxonomy.terms)}
            }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getCollections = (collections: readonly Readonly<CollectionModels.Collection>[]): string => {
		return collections.reduce((code, collection, index) => {
			const isLast = index === collections.length - 1;

			return `${code}\n
                ${wrapComment(collection.name)}
                ${collection.codename}: {
                    name: '${toSafePropertyValue(collection.name)}',
                    codename: '${collection.codename}',
                    id: '${collection.id}'
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getRoles = (roles: readonly Readonly<RoleModels.Role>[]): string => {
		return roles.reduce((code, role, index) => {
			const isLast = index === roles.length - 1;

			return `${code}\n
                ${wrapComment(role.name)}
                ${resolvePropertyName(role.codename ?? role.name)}: {
                    name: '${toSafePropertyValue(role.name)}',
                    codename: ${getStringOrUndefinedAsPropertyValue(role.codename)},
                    id: '${role.id}'
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getWebhooks = (webhooks: readonly Readonly<WebhookModels.Webhook>[]): string => {
		return webhooks.reduce((code, webhook, index) => {
			const isLast = index === webhooks.length - 1;

			return `${code}\n
                ${wrapComment(webhook.name)}
                ${resolvePropertyName(webhook.name)}: {
                    name: '${toSafePropertyValue(webhook.name)}',
                    url: '${webhook.url}',
                    id: '${webhook.id}'
                }${!isLast ? ",\n" : ""}`;
		}, "");
	};

	const getTaxonomyTerms = (terms: readonly Readonly<TaxonomyModels.Taxonomy>[]): string => {
		return `${terms.reduce<string>((code, term, index) => {
			const isLast = index === terms.length - 1;

			return `${code}\n
                    ${wrapComment(term.name)}
                    ${term.codename}: {
                        name: '${toSafePropertyValue(term.name)}',
                        codename: '${term.codename}',
                        id: '${term.id}',
                        externalId: ${getStringOrUndefinedAsPropertyValue(term.externalId)},
                        ${getTaxonomyTerms(term.terms)}
                    }${!isLast ? ",\n" : ""}`;
		}, "terms: {")}}`;
	};

	const getWorkflowSteps = (workflow: Readonly<WorkflowModels.Workflow>): string => {
		// The order of these steps should reflect the order in which they appear in the Kontent UI
		const steps: readonly WorkflowStep[] = [...workflow.steps, workflow.scheduledStep, workflow.publishedStep, workflow.archivedStep];

		return `{${steps.reduce((code, step) => {
			return `${code}
                ${step.codename}: {
                    name: '${toSafePropertyValue(step.name)}',
                    codename: '${step.codename}',
                    id: '${step.id}'
                },`;
		}, "")}}`;
	};

	const wrapInConst = ({ constName, text }: { readonly constName: string; readonly text: string }): string => {
		return `export const ${constName} = {
                    ${text}
                } as const;`;
	};

	return {
		generateEnvironmentModels,
	};
}
