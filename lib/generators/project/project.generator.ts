import { Options } from 'prettier';
import { commonHelper, IGeneratedFile } from '../../common-helper';
import { textHelper } from '../../text-helper';
import {
    AssetFolderModels,
    CollectionModels,
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    LanguageModels,
    EnvironmentModels,
    RoleModels,
    TaxonomyModels,
    WebhookModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { camelCasePropertyNameResolver } from '@kontent-ai/delivery-sdk';
import { ISortConfig } from 'lib/models';

interface IProjectCodeResult {
    filename: string;
    code: string;
}

interface IExtendedContentTypeElement {
    element: ContentTypeElements.ContentTypeElementModel;
    snippet?: ContentTypeSnippetModels.ContentTypeSnippet;
    mappedName: string | undefined;
}

export class ProjectGenerator {
    generateProjectModel(data: {
        outputDir: string;
        environmentInfo: EnvironmentModels.EnvironmentInformationModel;
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
        workflows: WorkflowModels.Workflow[];
        assetFolders: AssetFolderModels.AssetFolder[];
        collections: CollectionModels.Collection[];
        roles: RoleModels.Role[];
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        webhooks: WebhookModels.Webhook[];
        addTimestamp: boolean;
        projectFolderName: string;
        sortConfig: ISortConfig;
        formatOptions?: Options;
    }): IGeneratedFile[] {
        const projectCodes = this.getProjectModelCode({
            environmentInfo: data.environmentInfo,
            types: data.types,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            languages: data.languages,
            taxonomies: data.taxonomies,
            workflows: data.workflows,
            assetFolders: data.assetFolders,
            collections: data.collections,
            roles: data.roles,
            snippets: data.snippets,
            webhooks: data.webhooks,
            sortConfig: data.sortConfig
        });

        const headerCode = `
        /**
        * ${commonHelper.getAutogenerateNote(data.addTimestamp)}
        *
        * ${this.getEnvironmentComment(data.environmentInfo)}
        */`;

        const generatedFiles: IGeneratedFile[] = [];

        for (const projectCode of projectCodes) {
            const filePath = `${data.outputDir}${data.projectFolderName}${projectCode.filename}`;

            generatedFiles.push({
                filename: filePath,
                text: headerCode + '\n' + projectCode.code
            });
        }

        return generatedFiles;
    }

    getAssetFoldersCount(folders: AssetFolderModels.AssetFolder[], count: number = 0): number {
        count += folders.length;

        for (const folder of folders) {
            if (folder.folders) {
                count = this.getAssetFoldersCount(folder.folders, count);
            }
        }

        return count;
    }

    private getEnvironmentComment(environmentInfo: EnvironmentModels.EnvironmentInformationModel): string {
        let comment: string = `Project name: ${textHelper.toSafeName(environmentInfo.name)}`;

        comment += `\n* Environment: ${environmentInfo.environment}`;
        comment += `\n* Environment Id: ${environmentInfo.id}`;

        return comment;
    }

    private getContentTypeComment(contentType: ContentTypeModels.ContentType): string {
        let comment: string = `/**`;

        comment += `\n* ${textHelper.toSafeName(contentType.name)}`;
        comment += `\n*/`;

        return comment;
    }

    private getContentTypeSnippetComment(snippet: ContentTypeSnippetModels.ContentTypeSnippet): string {
        let comment: string = `/**`;

        comment += `\n* ${textHelper.toSafeName(snippet.name)}`;
        comment += `\n*/`;

        return comment;
    }

    private getWorkflowComment(workflow: WorkflowModels.Workflow): string {
        let comment: string = `/**`;

        comment += `\n* ${textHelper.toSafeName(workflow.name)}`;
        comment += `\n* Archived step Id: ${workflow.archivedStep.id}`;
        comment += `\n* Published step Id: ${workflow.publishedStep.id}`;
        comment += `\n*/`;

        return comment;
    }

    private getAssetFolderComment(assetFolder: AssetFolderModels.AssetFolder): string {
        let comment: string = `/**`;

        comment += `\n* ${textHelper.toSafeName(assetFolder.name)}`;
        comment += `\n*/`;

        return comment;
    }

    private getLanguageComment(language: LanguageModels.LanguageModel): string {
        let comment: string = `/**`;

        comment += `\n* ${textHelper.toSafeName(language.name)}`;
        comment += `\n*/`;

        return comment;
    }

    private getElementName(
        element: ContentTypeElements.ContentTypeElementModel,
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string | undefined {
        if ((element as any)['name']) {
            return (element as any)['name'];
        }

        if (element.type === 'taxonomy') {
            const taxonomy = taxonomies.find(
                (m) => m.id.toLowerCase() === element.taxonomy_group.id?.toLocaleLowerCase()
            );

            if (!taxonomy) {
                throw Error(`Invalid taxonomy with id '${element.taxonomy_group.id}'`);
            }

            return taxonomy.name;
        }

        return undefined;
    }

    private getElementComment(
        element: ContentTypeElements.ContentTypeElementModel,
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let comment: string = `/**`;
        const guidelines = commonHelper.getElementGuidelines(element);
        const name = commonHelper.getElementTitle(element, taxonomies);

        if (name) {
            comment += `\n* ${textHelper.toSafeName(name)} (${element.type})`;
        }

        if (guidelines) {
            comment += `\n*`;
            comment += `\n* ${textHelper.removeLineEndings(guidelines)}`;
        }

        comment += `\n*/`;

        return comment;
    }

    private getTaxonomyComment(taxonomy: TaxonomyModels.Taxonomy): string {
        let comment: string = `/**`;

        comment += `\n* ${textHelper.toSafeName(taxonomy.name)}`;
        comment += `\n*/`;

        return comment;
    }

    private getCollectionComment(collection: CollectionModels.Collection): string {
        let comment: string = `/**`;

        comment += `\n* ${textHelper.toSafeName(collection.name)}`;
        comment += `\n*/`;

        return comment;
    }

    private getRoleComment(role: RoleModels.Role): string {
        let comment: string = `/**`;

        comment += `\n* ${textHelper.toSafeName(role.name)}`;
        comment += `\n*/`;

        return comment;
    }

    private getWebhookComment(webhook: WebhookModels.Webhook): string {
        let comment: string = `/**`;

        comment += `\n* ${textHelper.toSafeName(webhook.name)}`;
        comment += `\n*/`;

        return comment;
    }

    private getProjectModelCode(data: {
        environmentInfo: EnvironmentModels.EnvironmentInformationModel;
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
        workflows: WorkflowModels.Workflow[];
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        assetFolders: AssetFolderModels.AssetFolder[];
        collections: CollectionModels.Collection[];
        roles: RoleModels.Role[];
        webhooks: WebhookModels.Webhook[];
        addTimestamp: boolean;
        sortConfig: ISortConfig;
        formatOptions?: Options;
    }): IProjectCodeResult[] {
        const result: IProjectCodeResult[] = [
            {
                code: `export const languages = {
                    ${this.getProjectLanguages(data.languages)}
                } as const;`,
                filename: 'languages.ts'
            },
            {
                code: `export const collections = {
                    ${this.getCollections(data.collections)}
                } as const;`,
                filename: 'collections.ts'
            },
            {
                code: `export const contentTypes = {
                    ${this.getProjectContentTypes(data.types, data.snippets, data.taxonomies)}
                } as const;`,
                filename: 'contentTypes.ts'
            },
            {
                code: `export const contentTypeSnippets = {
                    ${this.getProjectContentTypeSnippets(data.snippets, data.taxonomies)}
                } as const;`,
                filename: 'contentTypeSnippets.ts'
            },
            {
                code: `export const taxonomies = {
                    ${this.getProjectTaxonomies(data.taxonomies, data.sortConfig)}
                } as const;`,
                filename: 'taxonomies.ts'
            },
            {
                code: `export const workflows = {
                    ${this.getProjectWorkflows(data.workflows)}
                } as const;`,
                filename: 'workflows.ts'
            },
            {
                code: `export const roles = {
                    ${this.getRoles(data.roles)}
                } as const;`,
                filename: 'roles.ts'
            },
            {
                code: `export const assetFolders = ${this.getAssetFolders(data.assetFolders)} as const;`,
                filename: 'assetFolders.ts'
            },
            {
                code: `export const webhooks = {
                    ${this.getWebhooks(data.webhooks)}
                } as const;`,
                filename: 'webhooks.ts'
            }
        ];

        return result;
    }

    private getProjectLanguages(languages: LanguageModels.LanguageModel[]): string {
        let code: string = ``;
        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            const isLast = i === languages.length - 1;
            code += `\n`;
            code += `${this.getLanguageComment(language)}\n`;
            code += `${camelCasePropertyNameResolver('', language.codename)}: {
                codename: '${language.codename}',
                id: '${language.id}',
                isActive: ${language.isActive ? 'true' : 'false'},
                isDefault: ${language.isDefault ? 'true' : 'false'},
                fallbackLanguageId: ${this.getStringOrUndefined(language.fallbackLanguage?.id)},
                externalId: ${this.getStringOrUndefined(language.externalId)},
                name: '${commonHelper.escapeNameValue(language.name)}'}`;
            code += `${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getStringOrUndefined(text?: string): string {
        if (!text) {
            return 'undefined';
        }
        return `'${text}'`;
    }

    private getProjectWorkflows(workflows: WorkflowModels.Workflow[]): string {
        let code: string = ``;
        for (let i = 0; i < workflows.length; i++) {
            const workflow = workflows[i];
            const isLast = i === workflows.length - 1;

            code += `\n`;
            code += `${this.getWorkflowComment(workflow)}\n`;
            code += `${workflow.codename}: {
                codename: '${workflow.codename}',
                id: '${workflow.id}',
                name: '${commonHelper.escapeNameValue(workflow.name)}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getAssetFolders(assetFolders: AssetFolderModels.AssetFolder[]): string {
        let code: string = `{`;
        for (let i = 0; i < assetFolders.length; i++) {
            const assetFolder = assetFolders[i];
            const isLast = i === assetFolders.length - 1;

            code += `\n`;
            code += `${this.getAssetFolderComment(assetFolder)}\n`;
            code += `${camelCasePropertyNameResolver('', assetFolder.name)}: {
                id: '${assetFolder.id}',
                name: '${commonHelper.escapeNameValue(assetFolder.name)}',
                externalId: ${this.getStringOrUndefined(assetFolder.externalId)},
                folders: ${this.getAssetFolders(assetFolder.folders)}}${!isLast ? ',\n' : ''}`;
        }

        code += '}';

        return code;
    }

    private getProjectContentTypeSnippets(
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[],
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let code: string = ``;
        for (let i = 0; i < snippets.length; i++) {
            const snippet = snippets[i];
            const isLast = i === snippets.length - 1;

            code += `\n`;
            code += `${this.getContentTypeSnippetComment(snippet)}\n`;
            code += `${snippet.codename}: {
                codename: '${snippet.codename}',
                id: '${snippet.id}',
                externalId: ${this.getStringOrUndefined(snippet.externalId)},
                name: '${commonHelper.escapeNameValue(snippet.name)}',
                elements: {${this.getContentTypeSnippetElements(snippet, taxonomies)}}
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectContentTypes(
        contentTypes: ContentTypeModels.ContentType[],
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[],
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let code: string = ``;
        for (let i = 0; i < contentTypes.length; i++) {
            const contentType = contentTypes[i];
            const isLast = i === contentTypes.length - 1;

            code += `\n`;
            code += `${this.getContentTypeComment(contentType)}\n`;
            code += `${contentType.codename}: {
                codename: '${contentType.codename}',
                id: '${contentType.id}',
                externalId: ${this.getStringOrUndefined(contentType.externalId)},
                name: '${commonHelper.escapeNameValue(contentType.name)}',
                elements: {${this.getContentTypeElements(contentType, snippets, taxonomies)}}
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getContentTypeElements(
        contentType: ContentTypeModels.ContentType,
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[],
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let code: string = '';

        const extendedElements: IExtendedContentTypeElement[] = this.getExtendedElements(
            contentType,
            snippets,
            taxonomies
        );

        for (let i = 0; i < extendedElements.length; i++) {
            const extendedElement = extendedElements[i];
            const element = extendedElement.element;
            const codename = commonHelper.getElementCodename(element);
            const name = this.getElementName(element, taxonomies);

            if (!name) {
                // element does not have a name (e.g. guidelines)
                continue;
            }

            if (!codename) {
                // element does not have codename
                continue;
            }

            const isLast = i === extendedElements.length - 1;

            const isRequired = commonHelper.isElementRequired(element);

            const elementOptions = this.getElementOptions(element);

            code += `\n`;
            code += `${this.getElementComment(element, taxonomies)}\n`;
            code += `${codename}: {
                codename: '${codename}',
                id: '${element.id}',
                externalId: ${this.getStringOrUndefined(element.external_id)},
                name: '${commonHelper.escapeNameValue(name)}',
                required: ${isRequired},
                type: '${element.type}'
                ${elementOptions ? `, options: ${elementOptions}` : ''}
                ${
                    extendedElement.snippet
                        ? `, snippetCodename: ${this.getStringOrUndefined(extendedElement.snippet?.codename)}`
                        : ''
                }

            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getElementOptions(element: ContentTypeElements.ContentTypeElementModel): string | undefined {
        if (element.type === 'multiple_choice') {
            let stronglyTypedOptions: string = `{`;

            for (let i = 0; i < element.options.length; i++) {
                const isLast = i === element.options.length - 1;
                const option = element.options[i];

                stronglyTypedOptions += `${option.codename}: {
                    name: '${textHelper.toSafeName(option.name)}',
                    id: '${option.id}',
                    codename: '${option.codename}',
                    externalId: ${this.getStringOrUndefined(option.external_id)}
                }`;

                stronglyTypedOptions += !isLast ? ',\n' : '';
            }

            stronglyTypedOptions += `}`;

            return stronglyTypedOptions;
        }

        return undefined;
    }

    private getContentTypeSnippetElements(
        snippet: ContentTypeSnippetModels.ContentTypeSnippet,
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let code: string = '';

        for (let i = 0; i < snippet.elements.length; i++) {
            const element = snippet.elements[i];
            const codename = commonHelper.getElementCodename(element);
            const name = this.getElementName(element, taxonomies);

            if (!name) {
                // element does not have a name (e.g. guidelines)
                continue;
            }

            if (!codename) {
                // element does not have codename
                continue;
            }

            const isLast = i === snippet.elements.length - 1;

            const isRequired = commonHelper.isElementRequired(element);

            code += `\n`;
            code += `${this.getElementComment(element, taxonomies)}\n`;
            code += `${codename}: {
                codename: '${codename}',
                id: '${element.id}',
                externalId: ${this.getStringOrUndefined(element.external_id)},
                name: '${commonHelper.escapeNameValue(name)}',
                required: ${isRequired},
                type: '${element.type}',
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getExtendedElements(
        contentType: ContentTypeModels.ContentType,
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[],
        taxonomies: TaxonomyModels.Taxonomy[]
    ): IExtendedContentTypeElement[] {
        const extendedElements: IExtendedContentTypeElement[] = [];
        for (const element of contentType.elements) {
            if (element.type === 'snippet') {
                // get snippet elements
                const snippetElement: ContentTypeElements.ISnippetElement = element;
                const snippet = snippets.find((m) => m.id === snippetElement.snippet.id);

                if (!snippet) {
                    throw Error(
                        `Could not find content type snippet with id '${snippetElement.snippet.id}'. This snippet is used in type '${contentType.codename}'`
                    );
                }
                extendedElements.push(
                    ...snippet.elements.map((mElement) => {
                        const extendedElement: IExtendedContentTypeElement = {
                            element: mElement,
                            snippet: snippet,
                            mappedName: this.getElementName(mElement, taxonomies)
                        };

                        return extendedElement;
                    })
                );
            } else {
                extendedElements.push({
                    element: element,
                    snippet: undefined,
                    mappedName: this.getElementName(element, taxonomies)
                });
            }
        }

        return commonHelper.sortAlphabetically(extendedElements, (item) => item.mappedName ?? '');
    }

    private getProjectTaxonomies(taxonomies: TaxonomyModels.Taxonomy[], sortConfig: ISortConfig): string {
        let code: string = ``;
        for (let i = 0; i < taxonomies.length; i++) {
            const taxonomy = taxonomies[i];
            const isLast = i === taxonomies.length - 1;

            code += `\n`;
            code += `${this.getTaxonomyComment(taxonomy)}\n`;
            code += `${taxonomy.codename}: {
                codename: '${taxonomy.codename}',
                id: '${taxonomy.id}',
                externalId: ${this.getStringOrUndefined(taxonomy.externalId)},
                name: '${commonHelper.escapeNameValue(taxonomy.name)}',
                ${this.getProjectTaxonomiesTerms(taxonomy.terms, sortConfig)}
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getCollections(collections: CollectionModels.Collection[]): string {
        let code: string = ``;
        for (let i = 0; i < collections.length; i++) {
            const collection = collections[i];
            const isLast = i === collections.length - 1;

            code += `\n`;
            code += `${this.getCollectionComment(collection)}\n`;
            code += `${collection.codename}: {
                codename: '${collection.codename}',
                id: '${collection.id}',
                name: '${commonHelper.escapeNameValue(collection.name)}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getRoles(roles: RoleModels.Role[]): string {
        let code: string = ``;
        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            const isLast = i === roles.length - 1;

            code += `\n`;
            code += `${this.getRoleComment(role)}\n`;
            code += `${camelCasePropertyNameResolver('', role.name)}: {
                codename: ${role.codename ? "'" + role.codename + "'" : undefined},
                id: '${role.id}',
                name: '${commonHelper.escapeNameValue(role.name)}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getWebhooks(webhooks: WebhookModels.Webhook[]): string {
        let code: string = ``;
        for (let i = 0; i < webhooks.length; i++) {
            const webhook = webhooks[i];
            const isLast = i === webhooks.length - 1;

            code += `\n`;
            code += `${this.getWebhookComment(webhook)}\n`;
            code += `${camelCasePropertyNameResolver('', webhook.name)}: {
                url: '${webhook.url}',
                id: '${webhook.id}',
                name: '${commonHelper.escapeNameValue(webhook.name)}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomiesTerms(terms: TaxonomyModels.Taxonomy[], sortConfig: ISortConfig): string {
        if (terms.length === 0) {
            return `terms: {}`;
        }

        const sortedTerms: TaxonomyModels.Taxonomy[] = sortConfig.sortTaxonomyTerms
            ? commonHelper.sortAlphabetically(terms, (item) => item.name)
            : terms;

        let code: string = `terms: {`;
        for (let i = 0; i < sortedTerms.length; i++) {
            const term = sortedTerms[i];
            const isLast = i === sortedTerms.length - 1;
            code += `${term.codename}: {
                codename: '${term.codename}',
                id: '${term.id}',
                externalId: ${this.getStringOrUndefined(term.externalId)},
                name: '${commonHelper.escapeNameValue(term.name)}',
                ${this.getProjectTaxonomiesTerms(term.terms, sortConfig)}
            }${!isLast ? ',\n' : ''}`;
        }
        code += '}';

        return code;
    }
}

export const projectGenerator = new ProjectGenerator();
