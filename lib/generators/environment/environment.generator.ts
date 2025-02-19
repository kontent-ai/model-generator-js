import type {
    AssetFolderModels,
    CollectionModels,
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    CustomAppModels,
    EnvironmentModels,
    LanguageModels,
    RoleModels,
    TaxonomyModels,
    WebhookModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { match } from 'ts-pattern';
import { toGuidelinesComment, wrapComment } from '../../core/comment.utils.js';
import type { FlattenedElement, GeneratedFile, GeneratedSet } from '../../core/core.models.js';
import { getStringOrUndefinedAsPropertyValue, toSafePropertyValue } from '../../core/core.utils.js';
import { getFlattenedElements } from '../../core/element.utils.js';
import { resolvePropertyName } from '../../core/resolvers.js';

type WorkflowStep = {
    readonly name: string;
    readonly codename: string;
    readonly id: string;
};

export type EnvironmentEntities = {
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
};

export type EnvironmentGeneratorConfig = {
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
    readonly environmentEntities: EnvironmentEntities;
};

export function environmentGenerator(config: EnvironmentGeneratorConfig) {
    const generateEnvironmentModels = (): GeneratedSet => {
        return {
            folderName: undefined,
            files: [
                ...getEntityFiles<'languages'>({
                    filename: 'languages.ts',
                    propName: 'languages',
                    entities: config.environmentEntities.languages,
                    getCode: getLanguages
                }),
                ...getEntityFiles<'collections'>({
                    filename: 'collections.ts',
                    propName: 'collections',
                    entities: config.environmentEntities.collections,
                    getCode: getCollections
                }),
                ...getEntityFiles<'contentTypes'>({
                    filename: 'contentTypes.ts',
                    propName: 'contentTypes',
                    entities: config.environmentEntities.contentTypes,
                    getCode: getContentTypes
                }),
                ...getEntityFiles<'snippets'>({
                    filename: 'contentTypeSnippets.ts',
                    propName: 'contentTypeSnippets',
                    entities: config.environmentEntities.snippets,
                    getCode: getSnippets
                }),
                ...getEntityFiles<'workflows'>({
                    filename: 'workflows.ts',
                    propName: 'workflows',
                    entities: config.environmentEntities.workflows,
                    getCode: getWorkflows
                }),
                ...getEntityFiles<'roles'>({
                    filename: 'roles.ts',
                    propName: 'roles',
                    entities: config.environmentEntities.roles,
                    getCode: getRoles
                }),
                ...getEntityFiles<'assetFolders'>({
                    filename: 'assetFolders.ts',
                    propName: 'assetFolders',
                    entities: config.environmentEntities.assetFolders,
                    getCode: getAssetFolders
                }),
                ...getEntityFiles<'webhooks'>({
                    filename: 'webhooks.ts',
                    propName: 'webhooks',
                    entities: config.environmentEntities.webhooks,
                    getCode: getWebhooks
                }),
                ...getEntityFiles<'taxonomies'>({
                    filename: 'taxonomies.ts',
                    propName: 'taxonomies',
                    entities: config.environmentEntities.taxonomies,
                    getCode: getTaxonomies
                }),
                ...getEntityFiles<'customApps'>({
                    filename: 'customApps.ts',
                    propName: 'customApps',
                    entities: config.environmentEntities.customApps,
                    getCode: getCustomApps
                })
            ]
        };
    };

    const getEntityFiles = <TProp extends keyof EnvironmentEntities>({
        entities,
        getCode,
        filename,
        propName
    }: {
        readonly filename: string;
        readonly propName: string;
        readonly entities: EnvironmentEntities[TProp];
        readonly getCode: (entities: NonNullable<EnvironmentEntities[TProp]>) => string;
    }): readonly GeneratedFile[] => {
        if (!entities) {
            return [];
        }

        return [
            {
                filename: filename,
                text: wrapInConst({ propName, text: getCode(entities) })
            }
        ];
    };

    const getLanguages = (languages: readonly Readonly<LanguageModels.LanguageModel>[]): string => {
        return languages.reduce((code, language, index) => {
            const isLast = index === languages.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${language.name}
                `)}
                ${resolvePropertyName(language.codename)}: {
                    name: '${toSafePropertyValue(language.name)}',
                    codename: '${language.codename}',
                    id: '${language.id}',
                    isActive: ${language.isActive ? 'true' : 'false'},
                    isDefault: ${language.isDefault ? 'true' : 'false'},
                    fallbackLanguageId: ${getStringOrUndefinedAsPropertyValue(language.fallbackLanguage?.id)},
                    externalId: ${getStringOrUndefinedAsPropertyValue(language.externalId)},
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getWorkflows = (workflows: readonly Readonly<WorkflowModels.Workflow>[]): string => {
        return workflows.reduce((code, workflow, index) => {
            const isLast = index === workflows.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${workflow.name}
                `)}
                ${workflow.codename}: {
                    name: '${toSafePropertyValue(workflow.name)}',
                    codename: '${workflow.codename}',
                    id: '${workflow.id}',
                    steps: ${getWorkflowSteps(workflow)}
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getCustomApps = (customApps: readonly Readonly<CustomAppModels.CustomApp>[]): string => {
        return customApps.reduce((code, customApp, index) => {
            const isLast = index === customApps.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${customApp.name}
                `)}
                ${resolvePropertyName(customApp.codename)}: {
                    codename: ${customApp.codename},
                    name: '${toSafePropertyValue(customApp.name)}',
                    sourceUrl: '${customApp.source_url}'
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getAssetFolders = (assetFolders: readonly Readonly<AssetFolderModels.AssetFolder>[], isFirstLevel = true): string => {
        return (
            assetFolders.reduce(
                (code, assetFolder, index) => {
                    const isLast = index === assetFolders.length - 1;

                    return `${code}\n
                 ${wrapComment(`
                * ${assetFolder.name}
                `)}
                ${assetFolder.codename}: {
                    name: '${toSafePropertyValue(assetFolder.name)}',
                    codename: '${assetFolder.codename}',
                    id: '${assetFolder.id}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(assetFolder.externalId)},
                    folders: ${getAssetFolders(assetFolder.folders, false)}}${!isLast ? ',\n' : ''}`;
                },
                !isFirstLevel ? '{' : ''
            ) + (!isFirstLevel ? '}' : '')
        );
    };

    const getSnippets = (snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]): string => {
        return snippets.reduce((code, snippet, index) => {
            const isLast = index === snippets.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${snippet.name}
                `)}
                ${snippet.codename}: {
                    name: '${toSafePropertyValue(snippet.name)}',
                    codename: '${snippet.codename}',
                    id: '${snippet.id}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(snippet.externalId)},
                    elements: {${getContentTypeElements(snippet.elements)}}
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getContentTypes = (contentTypes: readonly Readonly<ContentTypeModels.ContentType>[]): string => {
        return contentTypes.reduce((code, contentType, index) => {
            const isLast = index === contentTypes.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${contentType.name}
                `)}
                ${contentType.codename}: {
                    name: '${toSafePropertyValue(contentType.name)}',
                    codename: '${contentType.codename}',
                    id: '${contentType.id}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(contentType.externalId)},
                    elements: {${getContentTypeElements(contentType.elements)}}
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getContentTypeElements = (elements: readonly Readonly<ContentTypeElements.ContentTypeElementModel>[]): string => {
        if (!config.environmentEntities.snippets) {
            throw new Error('Snippets are expected to be present in the environment entities.');
        }
        if (!config.environmentEntities.taxonomies) {
            throw new Error('Taxonomies are expected to be present in the environment entities.');
        }
        if (!config.environmentEntities.contentTypes) {
            throw new Error('Content types are expected to be present in the environment entities.');
        }

        const flattenedElements = getFlattenedElements({
            elements: elements,
            snippets: config.environmentEntities.snippets,
            taxonomies: config.environmentEntities.taxonomies,
            types: config.environmentEntities.contentTypes
        });

        return flattenedElements.reduce((code, element, index) => {
            const isLast = index === flattenedElements.length - 1;
            const elementOptions = getElementOptionsCode(element);

            return `${code}
                ${wrapComment(`
                * ${element.title} (${element.type})${element.guidelines ? `\n* Guidelines: ${toGuidelinesComment(element.guidelines)}` : ''}
                `)}
                ${element.codename}: {
                    name: '${toSafePropertyValue(element.title)}',
                    codename: '${element.codename}',
                    id: '${element.id}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(element.externalId)},
                    required: ${element.isRequired},
                    type: '${element.type}'
                    ${elementOptions ? `, options: ${elementOptions}` : ''}
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getElementOptionsCode = (flattenedElement: FlattenedElement): string | undefined => {
        return match(flattenedElement.originalElement)
            .returnType<string | undefined>()
            .with({ type: 'multiple_choice' }, (element) => {
                return (
                    element.options.reduce<string>((code, option, index) => {
                        const isLast = index === element.options.length - 1;
                        return `${code}\n
                ${wrapComment(`
                * ${option.name}
                `)}
                ${option.codename ? option.codename : resolvePropertyName(option.name)}: {
                    name: '${toSafePropertyValue(option.name)}',
                    id: '${option.id}',
                    codename: ${getStringOrUndefinedAsPropertyValue(option.codename)},
                    externalId: ${getStringOrUndefinedAsPropertyValue(option.external_id)}
                }${!isLast ? ',\n' : ''}`;
                    }, '{') + '}'
                );
            })
            .otherwise(() => undefined);
    };

    const getTaxonomies = (taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]): string => {
        return taxonomies.reduce((code, taxonomy, index) => {
            const isLast = index === taxonomies.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${taxonomy.codename}
                `)}
                 ${taxonomy.codename}: {
                    name: '${toSafePropertyValue(taxonomy.name)}',
                    codename: '${taxonomy.codename}',
                    externalId: ${getStringOrUndefinedAsPropertyValue(taxonomy.externalId)},
                    id: '${taxonomy.id}',
                    ${getTaxonomyTerms(taxonomy.terms)}
            }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getCollections = (collections: readonly Readonly<CollectionModels.Collection>[]): string => {
        return collections.reduce((code, collection, index) => {
            const isLast = index === collections.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${collection.name}
                `)}
                ${collection.codename}: {
                    codename: '${collection.codename}',
                    id: '${collection.id}',
                    name: '${toSafePropertyValue(collection.name)}'
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getRoles = (roles: readonly Readonly<RoleModels.Role>[]): string => {
        return roles.reduce((code, role, index) => {
            const isLast = index === roles.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${role.name}
                `)}
                ${resolvePropertyName(role.codename ?? role.name)}: {
                    codename: ${getStringOrUndefinedAsPropertyValue(role.codename)},
                    id: '${role.id}',
                    name: '${toSafePropertyValue(role.name)}'
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getWebhooks = (webhooks: readonly Readonly<WebhookModels.Webhook>[]): string => {
        return webhooks.reduce((code, webhook, index) => {
            const isLast = index === webhooks.length - 1;

            return `${code}\n
                ${wrapComment(`
                * ${webhook.name}
                `)}
                ${resolvePropertyName(webhook.name)}: {
                    url: '${webhook.url}',
                    id: '${webhook.id}',
                    name: '${toSafePropertyValue(webhook.name)}'
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getTaxonomyTerms = (terms: readonly Readonly<TaxonomyModels.Taxonomy>[]): string => {
        return (
            terms.reduce<string>((code, term, index) => {
                const isLast = index === terms.length - 1;

                return `${code}\n
                    ${wrapComment(`
                    * ${term.name}
                    `)}
                    ${term.codename}: {
                        codename: '${term.codename}',
                        id: '${term.id}',
                        externalId: ${getStringOrUndefinedAsPropertyValue(term.externalId)},
                        name: '${toSafePropertyValue(term.name)}',
                        ${getTaxonomyTerms(term.terms)}
                    }${!isLast ? ',\n' : ''}`;
            }, 'terms: {') + '}'
        );
    };

    const getWorkflowSteps = (workflow: Readonly<WorkflowModels.Workflow>): string => {
        // The order of these steps should reflect the order in which they appear in the Kontent UI
        const steps: readonly WorkflowStep[] = [...workflow.steps, workflow.scheduledStep, workflow.publishedStep, workflow.archivedStep];

        return `{${steps.reduce((code, step) => {
            return (
                code +
                `
                ${step.codename}: {
                    name: '${toSafePropertyValue(step.name)}',
                    codename: '${step.codename}',
                    id: '${step.id}'
                },`
            );
        }, ``)}}`;
    };

    const wrapInConst = ({ propName, text }: { readonly propName: string; readonly text: string }): string => {
        return `export const ${propName} = {
                    ${text}
                } as const;`;
    };

    return {
        generateEnvironmentModels
    };
}
