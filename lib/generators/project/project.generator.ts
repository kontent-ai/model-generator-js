import * as fs from 'fs';
import { yellow } from 'colors';
import { format, Options } from 'prettier';
import { commonHelper, IGenerateProjectResult } from '../../common-helper';
import { textHelper } from '../../text-helper';
import {
    AssetFolderModels,
    CollectionModels,
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    LanguageModels,
    ProjectModels,
    RoleModels,
    TaxonomyModels,
    WebhookModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { camelCasePropertyNameResolver } from '@kontent-ai/delivery-sdk';

interface IProjectCodeResult {
    filename: string;
    code: string;
}

interface IExtendedContentTypeElement {
    element: ContentTypeElements.ContentTypeElementModel;
    snippet?: ContentTypeSnippetModels.ContentTypeSnippet;
}

export class ProjectGenerator {
    generateProjectModel(data: {
        projectInformation: ProjectModels.ProjectInformationModel;
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
        folderPath: string;
        formatOptions?: Options;
    }): IGenerateProjectResult {
        const projectCodes = this.getProjectModelCode({
            projectInformation: data.projectInformation,
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
            webhooks: data.webhooks
        });

        const headerCode = `
        /**
        * ${commonHelper.getAutogenerateNote(data.addTimestamp)}
        *
        * ${this.getProjectComment(data.projectInformation)}
        */`;

        const filePaths: string[] = [];

        const formatOptions: Options = data.formatOptions
            ? data.formatOptions
            : {
                  parser: 'typescript',
                  singleQuote: true
              };

        for (const projectCode of projectCodes) {
            const filePath = `${data.folderPath}${projectCode.filename}`;
            this.createFileOnFs(format(headerCode + '\n' + projectCode.code, formatOptions), `./${filePath}`);
            filePaths.push(filePath);
        }

        return {
            filenames: filePaths
        };
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

    private getProjectComment(projectInformation: ProjectModels.ProjectInformationModel): string {
        let comment: string = `Project name: ${projectInformation.name}`;

        comment += `\n* Environment: ${projectInformation.environment}`;
        comment += `\n* Project Id: ${projectInformation.id}`;

        return comment;
    }

    private getContentTypeComment(contentType: ContentTypeModels.ContentType): string {
        let comment: string = `/**`;

        comment += `\n* ${contentType.name}`;
        comment += `\n* Last modified: ${contentType.lastModified}`;
        comment += `\n*/`;

        return comment;
    }

    private getContentTypeSnippetComment(snippet: ContentTypeSnippetModels.ContentTypeSnippet): string {
        let comment: string = `/**`;

        comment += `\n* ${snippet.name}`;
        comment += `\n* Last modified: ${snippet.lastModified}`;
        comment += `\n*/`;

        return comment;
    }

    private getWorkflowComment(workflow: WorkflowModels.Workflow): string {
        let comment: string = `/**`;

        comment += `\n* ${workflow.name}`;
        comment += `\n* Archived step Id: ${workflow.archivedStep.id}`;
        comment += `\n* Published step Id: ${workflow.publishedStep.id}`;
        comment += `\n*/`;

        return comment;
    }

    private getAssetFolderComment(assetFolder: AssetFolderModels.AssetFolder): string {
        let comment: string = `/**`;

        comment += `\n* ${assetFolder.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getLanguageComment(language: LanguageModels.LanguageModel): string {
        let comment: string = `/**`;

        comment += `\n* ${language.name}`;
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
            comment += `\n* ${name} (${element.type})`;
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

        comment += `\n* ${taxonomy.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getCollectionComment(collection: CollectionModels.Collection): string {
        let comment: string = `/**`;

        comment += `\n* ${collection.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getRoleComment(role: RoleModels.Role): string {
        let comment: string = `/**`;

        comment += `\n* ${role.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getWebhookComment(webhook: WebhookModels.Webhook): string {
        let comment: string = `/**`;

        comment += `\n* ${webhook.name}`;
        comment += `\n* Last modified: ${webhook.lastModified}`;
        comment += `\n*/`;

        return comment;
    }

    private getProjectModelCode(data: {
        projectInformation: ProjectModels.ProjectInformationModel;
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
        formatOptions?: Options;
    }): IProjectCodeResult[] {
        const result: IProjectCodeResult[] = [
            {
                code: `export const languages = {
                    ${this.getProjectLanguages(data.languages)}
                };`,
                filename: 'languages.ts'
            },
            {
                code: `export const collections = {
                    ${this.getCollections(data.collections)}
                };`,
                filename: 'collections.ts'
            },
            {
                code: `export const contentTypes = {
                    ${this.getProjectContentTypes(data.types, data.snippets, data.taxonomies)}
                };`,
                filename: 'contentTypes.ts'
            },
            {
                code: `export const contentTypeSnippets = {
                    ${this.getProjectContentTypeSnippets(data.snippets, data.taxonomies)}
                };`,
                filename: 'contentTypeSnippets.ts'
            },
            {
                code: `export const taxonomies = {
                    ${this.getProjectTaxonomies(data.taxonomies)}
                };`,
                filename: 'taxonomies.ts'
            },
            {
                code: `export const workflows = {
                    ${this.getProjectWorkflows(data.workflows)}
                };`,
                filename: 'workflows.ts'
            },
            {
                code: `export const roles = {
                    ${this.getRoles(data.roles)}
                };`,
                filename: 'roles.ts'
            },
            {
                code: `export const assetFolders = ${this.getAssetFolders(data.assetFolders)};`,
                filename: 'assetFolders.ts'
            },
            {
                code: `export const webhooks = {
                    ${this.getWebhooks(data.webhooks)}
                };`,
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
                name: '${assetFolder.name}',
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

        const extendedElements: IExtendedContentTypeElement[] = this.getExtendedElements(contentType, snippets);

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

            code += `\n`;
            code += `${this.getElementComment(element, taxonomies)}\n`;
            code += `${codename}: {
                codename: '${codename}',
                id: '${element.id}',
                externalId: ${this.getStringOrUndefined(element.external_id)},
                name: '${commonHelper.escapeNameValue(name)}',
                required: ${isRequired},
                type: '${element.type}',
                snippetCodename: ${this.getStringOrUndefined(extendedElement.snippet?.codename)}
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
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
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[]
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
                            snippet: snippet
                        };

                        return extendedElement;
                    })
                );
            } else {
                extendedElements.push({
                    element: element,
                    snippet: undefined
                });
            }
        }

        return extendedElements;
    }

    private getProjectTaxonomies(taxonomies: TaxonomyModels.Taxonomy[]): string {
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
                ${this.getProjectTaxonomiesTerms(taxonomy.terms)}
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

    private getProjectTaxonomiesTerms(terms: TaxonomyModels.Taxonomy[]): string {
        if (terms.length === 0) {
            return `terms: {}`;
        }

        let code: string = `terms: {`;
        for (let i = 0; i < terms.length; i++) {
            const term = terms[i];
            const isLast = i === terms.length - 1;
            code += `${term.codename}: {
                codename: '${term.codename}',
                id: '${term.id}',
                externalId: ${this.getStringOrUndefined(term.externalId)},
                name: '${commonHelper.escapeNameValue(term.name)}',
                ${this.getProjectTaxonomiesTerms(term.terms)}
            }${!isLast ? ',\n' : ''}`;
        }
        code += '}';

        return code;
    }

    private createFileOnFs(code: string, filename: string): void {
        const finalFilename = `${filename}`;

        fs.writeFileSync('./' + finalFilename, code);

        console.log(`Created '${yellow(finalFilename)}'`);
    }
}

export const projectGenerator = new ProjectGenerator();
