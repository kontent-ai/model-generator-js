import {
    AssetFolderModels,
    CollectionModels,
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    EnvironmentModels,
    LanguageModels,
    RoleModels,
    TaxonomyModels,
    WebhookModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { match } from 'ts-pattern';
import {
    FlattenedElement,
    GeneratedFile,
    getFlattenedElements,
    getStringOrUndefined,
    sortAlphabetically,
    toCamelCase,
    toGuidelinesComment,
    toSafeString
} from '../../core/index.js';

interface WorkflowStep {
    readonly name: string;
    readonly codename: string;
    readonly id: string;
}

export interface ProjectGeneratorConfig {
    readonly environmentData: {
        readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
        readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
        readonly languages: readonly Readonly<LanguageModels.LanguageModel>[];
        readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
        readonly workflows: readonly Readonly<WorkflowModels.Workflow>[];
        readonly assetFolders: readonly Readonly<AssetFolderModels.AssetFolder>[];
        readonly collections: readonly Readonly<CollectionModels.Collection>[];
        readonly roles: readonly Readonly<RoleModels.Role>[];
        readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[];
        readonly webhooks: readonly Readonly<WebhookModels.Webhook>[];
    };
}

export function projectGenerator(config: ProjectGeneratorConfig) {
    const generateProjectModel = (): readonly GeneratedFile[] => {
        return [
            {
                text: `export const languages = {
                    ${getProjectLanguages(config.environmentData.languages)}
                } as const;`,
                filename: 'languages.ts'
            },
            {
                text: `export const collections = {
                    ${getCollections(config.environmentData.collections)}
                } as const;`,
                filename: 'collections.ts'
            },
            {
                text: `export const contentTypes = {
                    ${getProjectContentTypes(config.environmentData.types)}
                } as const;`,
                filename: 'contentTypes.ts'
            },
            {
                text: `export const contentTypeSnippets = {
                    ${getProjectContentTypeSnippets(config.environmentData.snippets)}
                } as const;`,
                filename: 'contentTypeSnippets.ts'
            },
            {
                text: `export const taxonomies = {
                    ${getProjectTaxonomies(config.environmentData.taxonomies)}
                } as const;`,
                filename: 'taxonomies.ts'
            },
            {
                text: `export const workflows = {
                    ${getProjectWorkflows(config.environmentData.workflows)}
                } as const;`,
                filename: 'workflows.ts'
            },
            {
                text: `export const roles = {
                    ${getRoles(config.environmentData.roles)}
                } as const;`,
                filename: 'roles.ts'
            },
            {
                text: `export const assetFolders = ${getAssetFolders(config.environmentData.assetFolders)} as const;`,
                filename: 'assetFolders.ts'
            },
            {
                text: `export const webhooks = {
                    ${getWebhooks(config.environmentData.webhooks)}
                } as const;`,
                filename: 'webhooks.ts'
            }
        ];
    };

    const getProjectLanguages = (languages: readonly Readonly<LanguageModels.LanguageModel>[]): string => {
        return languages.reduce((code, language, index) => {
            const isLast = index === languages.length - 1;

            return `${code}\n
                /**
                * ${toSafeString(language.name)}
                */
                ${toCamelCase(language.codename)}: {
                    codename: '${language.codename}',
                    id: '${language.id}',
                    name: '${toSafeString(language.name)}',
                    isActive: ${language.isActive ? 'true' : 'false'},
                    isDefault: ${language.isDefault ? 'true' : 'false'},
                    fallbackLanguageId: ${getStringOrUndefined(language.fallbackLanguage?.id)},
                    externalId: ${getStringOrUndefined(language.externalId)},
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getProjectWorkflows = (workflows: readonly Readonly<WorkflowModels.Workflow>[]): string => {
        return workflows.reduce((code, workflow, index) => {
            const isLast = index === workflows.length - 1;

            return `${code}\n
                /**
                * ${toSafeString(workflow.name)}
                */
                ${toCamelCase(workflow.codename)}: {
                    codename: '${workflow.codename}',
                    id: '${workflow.id}',
                    name: '${toSafeString(workflow.name)}',
                    steps: ${getProjectWorkflowSteps(workflow)}
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getAssetFolders = (assetFolders: readonly Readonly<AssetFolderModels.AssetFolder>[]): string => {
        return (
            assetFolders.reduce((code, assetFolder, index) => {
                const isLast = index === assetFolders.length - 1;

                return `${code}\n
                /**
                * ${toSafeString(assetFolder.name)}
                */
                ${toCamelCase(assetFolder.codename)}: {
                    codename: '${assetFolder.codename}',
                    id: '${assetFolder.id}',
                    externalId: ${getStringOrUndefined(assetFolder.externalId)},
                    name: '${toSafeString(assetFolder.name)}',
                    folders: ${getAssetFolders(assetFolder.folders)}}${!isLast ? ',\n' : ''}`;
            }, '{') + '}'
        );
    };

    const getProjectContentTypeSnippets = (snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]): string => {
        return snippets.reduce((code, snippet, index) => {
            const isLast = index === snippets.length - 1;

            return `${code}\n
                /**
                * ${toSafeString(snippet.name)}
                */
                ${toCamelCase(snippet.codename)}: {
                    codename: '${snippet.codename}',
                    id: '${snippet.id}',
                    externalId: ${getStringOrUndefined(snippet.externalId)},
                    name: '${toSafeString(snippet.name)}',
                    elements: {${getContentTypeElements(snippet.elements)}}
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getProjectContentTypes = (contentTypes: readonly Readonly<ContentTypeModels.ContentType>[]): string => {
        return contentTypes.reduce((code, contentType, index) => {
            const isLast = index === contentTypes.length - 1;

            return `${code}\n
                /**
                * ${toSafeString(contentType.name)}
                */
                ${toCamelCase(contentType.codename)}: {
                    codename: '${contentType.codename}',
                    id: '${contentType.id}',
                    externalId: ${getStringOrUndefined(contentType.externalId)},
                    name: '${toSafeString(contentType.name)}',
                    elements: {${getContentTypeElements(contentType.elements)}}
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getContentTypeElements = (elements: readonly Readonly<ContentTypeElements.ContentTypeElementModel>[]): string => {
        const flattenedElements = getFlattenedElements(
            elements,
            config.environmentData.snippets,
            config.environmentData.taxonomies,
            config.environmentData.types
        );

        return flattenedElements.reduce((code, element, index) => {
            const isLast = index === flattenedElements.length - 1;
            const elementOptions = getElementOptionsCode(element);

            return `${code}\n
                /**
                * ${toSafeString(element.title)} (${element.type})${element.guidelines ? `\n* Guidelines: ${toGuidelinesComment(element.guidelines)}` : ''}
                */
                ${toCamelCase(element.codename)}: {
                    codename: '${element.codename}',
                    id: '${element.id}',
                    externalId: ${getStringOrUndefined(element.externalId)},
                    name: '${toSafeString(element.title)}',
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
                /**
                * ${toSafeString(option.name)}
                */
                ${toCamelCase(option.codename ?? option.name)}: {
                    name: '${toSafeString(option.name)}',
                    id: '${option.id}',
                    codename: ${getStringOrUndefined(option.codename)},
                    externalId: ${getStringOrUndefined(option.external_id)}
                }${!isLast ? ',\n' : ''}`;
                    }, '{') + '}'
                );
            })
            .otherwise(() => undefined);
    };

    const getProjectTaxonomies = (taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]): string => {
        return taxonomies.reduce((code, taxonomy, index) => {
            const isLast = index === taxonomies.length - 1;

            return `${code}\n
                /**
                * ${toSafeString(taxonomy.name)}
                */
                ${toCamelCase(taxonomy.codename)}: {
                    codename: '${taxonomy.codename}',
                    externalId: ${getStringOrUndefined(taxonomy.externalId)},
                    id: '${taxonomy.id}',
                    name: '${toSafeString(taxonomy.name)}',
                    ${getProjectTaxonomiesTerms(taxonomy.terms)}
            }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getCollections = (collections: readonly Readonly<CollectionModels.Collection>[]): string => {
        return collections.reduce((code, collection, index) => {
            const isLast = index === collections.length - 1;

            return `${code}\n
                /**
                * ${toSafeString(collection.name)}
                */
                ${toCamelCase(collection.codename)}: {
                    codename: '${collection.codename}',
                    id: '${collection.id}',
                    name: '${toSafeString(collection.name)}'
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getRoles = (roles: readonly Readonly<RoleModels.Role>[]): string => {
        return roles.reduce((code, role, index) => {
            const isLast = index === roles.length - 1;

            return `${code}\n
                /**
                * ${toSafeString(role.name)}
                */
                ${toCamelCase(role.codename ?? role.name)}: {
                    codename: ${getStringOrUndefined(role.codename)},
                    id: '${role.id}',
                    name: '${toSafeString(role.name)}'
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getWebhooks = (webhooks: readonly Readonly<WebhookModels.Webhook>[]): string => {
        return webhooks.reduce((code, webhook, index) => {
            const isLast = index === webhooks.length - 1;

            return `${code}\n
                /**
                * ${toSafeString(webhook.name)}
                */
                ${toCamelCase(webhook.name)}: {
                    url: '${webhook.url}',
                    id: '${webhook.id}',
                    name: '${toSafeString(webhook.name)}'
                }${!isLast ? ',\n' : ''}`;
        }, '');
    };

    const getProjectTaxonomiesTerms = (terms: readonly Readonly<TaxonomyModels.Taxonomy>[]): string => {
        const sortedTerms = sortAlphabetically(terms, (item) => item.name);

        return (
            sortedTerms.reduce<string>((code, term, index) => {
                const isLast = index === sortedTerms.length - 1;

                return `${code}\n
                    /**
                    * ${toSafeString(term.name)}
                    */
                    ${toCamelCase(term.codename)}: {
                        codename: '${term.codename}',
                        id: '${term.id}',
                        externalId: ${getStringOrUndefined(term.externalId)},
                        name: '${toSafeString(term.name)}',
                        ${getProjectTaxonomiesTerms(term.terms)}
                    }${!isLast ? ',\n' : ''}`;
            }, 'terms: {') + '}'
        );
    };

    const getProjectWorkflowSteps = (workflow: Readonly<WorkflowModels.Workflow>): string => {
        const steps: readonly WorkflowStep[] = [workflow.archivedStep, workflow.publishedStep, workflow.scheduledStep, ...workflow.steps];

        return `{${steps.reduce((code, step) => {
            return (
                code +
                `
                ${toCamelCase(step.codename)}: {
                    name: '${toSafeString(step.name)}',
                    codename: '${step.codename}',
                    id: '${step.id}'
                },`
            );
        }, ``)}}`;
    };

    return {
        generateProjectModel
    };
}
