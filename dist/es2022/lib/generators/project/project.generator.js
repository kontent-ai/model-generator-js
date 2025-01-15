import { commonHelper } from '../../common-helper.js';
import { textHelper } from '../../text-helper.js';
import { camelCasePropertyNameResolver } from '@kontent-ai/delivery-sdk';
export class ProjectGenerator {
    generateProjectModel(data) {
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
        let headerCode = `
/**
* ${commonHelper.getAutogenerateNote(data.addTimestamp)}`;
        if (data.addEnvironmentInfo) {
            headerCode += `
* 
* ${this.getEnvironmentComment(data.environmentInfo)}`;
        }
        headerCode += `
*/`;
        const generatedFiles = [];
        for (const projectCode of projectCodes) {
            const filePath = `${data.outputDir}${data.projectFolderName}${projectCode.filename}`;
            generatedFiles.push({
                filename: filePath,
                text: headerCode + '\n' + projectCode.code
            });
        }
        return generatedFiles;
    }
    getAssetFoldersCount(folders, count = 0) {
        count += folders.length;
        for (const folder of folders) {
            if (folder.folders) {
                count = this.getAssetFoldersCount(folder.folders, count);
            }
        }
        return count;
    }
    getEnvironmentComment(environmentInfo) {
        let comment = `Project name: ${textHelper.toSafeName(environmentInfo.name, 'space')}`;
        comment += `\n* Environment: ${environmentInfo.environment}`;
        comment += `\n* Environment Id: ${environmentInfo.id}`;
        return comment;
    }
    getContentTypeComment(contentType) {
        let comment = `/**`;
        comment += `\n* ${textHelper.toSafeName(contentType.name, 'space')}`;
        comment += `\n*/`;
        return comment;
    }
    getContentTypeSnippetComment(snippet) {
        let comment = `/**`;
        comment += `\n* ${textHelper.toSafeName(snippet.name, 'space')}`;
        comment += `\n*/`;
        return comment;
    }
    getWorkflowComment(workflow) {
        let comment = `/**`;
        comment += `\n* ${textHelper.toSafeName(workflow.name, 'space')}`;
        comment += `\n* Archived step Id: ${workflow.archivedStep.id}`;
        comment += `\n* Published step Id: ${workflow.publishedStep.id}`;
        comment += `\n*/`;
        return comment;
    }
    getAssetFolderComment(assetFolder) {
        let comment = `/**`;
        comment += `\n* ${textHelper.toSafeName(assetFolder.name, 'space')}`;
        comment += `\n*/`;
        return comment;
    }
    getLanguageComment(language) {
        let comment = `/**`;
        comment += `\n* ${textHelper.toSafeName(language.name, 'space')}`;
        comment += `\n*/`;
        return comment;
    }
    getElementName(element, taxonomies) {
        if (element['name']) {
            return element['name'];
        }
        if (element.type === 'taxonomy') {
            const taxonomy = taxonomies.find((m) => m.id.toLowerCase() === element.taxonomy_group.id?.toLocaleLowerCase());
            if (!taxonomy) {
                throw Error(`Invalid taxonomy with id '${element.taxonomy_group.id}'`);
            }
            return taxonomy.name;
        }
        return undefined;
    }
    getElementComment(element, taxonomies) {
        let comment = `/**`;
        const guidelines = commonHelper.getElementGuidelines(element);
        const name = commonHelper.getElementTitle(element, taxonomies);
        if (name) {
            comment += `\n* ${textHelper.toSafeName(name, 'space')} (${element.type})`;
        }
        if (guidelines) {
            comment += `\n*`;
            comment += `\n* ${textHelper.removeLineEndings(guidelines)}`;
        }
        comment += `\n*/`;
        return comment;
    }
    getTaxonomyComment(taxonomy) {
        let comment = `/**`;
        comment += `\n* ${textHelper.toSafeName(taxonomy.name, 'space')}`;
        comment += `\n*/`;
        return comment;
    }
    getCollectionComment(collection) {
        let comment = `/**`;
        comment += `\n* ${textHelper.toSafeName(collection.name, 'space')}`;
        comment += `\n*/`;
        return comment;
    }
    getRoleComment(role) {
        let comment = `/**`;
        comment += `\n* ${textHelper.toSafeName(role.name, 'space')}`;
        comment += `\n*/`;
        return comment;
    }
    getWebhookComment(webhook) {
        let comment = `/**`;
        comment += `\n* ${textHelper.toSafeName(webhook.name, 'space')}`;
        comment += `\n*/`;
        return comment;
    }
    getProjectModelCode(data) {
        const result = [
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
    getProjectLanguages(languages) {
        let code = ``;
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
    getStringOrUndefined(text) {
        if (!text) {
            return 'undefined';
        }
        return `'${text}'`;
    }
    getProjectWorkflows(workflows) {
        let code = ``;
        for (let i = 0; i < workflows.length; i++) {
            const workflow = workflows[i];
            const isLast = i === workflows.length - 1;
            code += `\n`;
            code += `${this.getWorkflowComment(workflow)}\n`;
            code += `${workflow.codename}: {
                codename: '${workflow.codename}',
                id: '${workflow.id}',
                name: '${commonHelper.escapeNameValue(workflow.name)}',
                steps: ${this.getProjectWorkflowSteps(workflow)}
            }${!isLast ? ',\n' : ''}`;
        }
        return code;
    }
    getAssetFolders(assetFolders) {
        let code = `{`;
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
    getProjectContentTypeSnippets(snippets, taxonomies) {
        let code = ``;
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
    getProjectContentTypes(contentTypes, snippets, taxonomies) {
        let code = ``;
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
    getContentTypeElements(contentType, snippets, taxonomies) {
        let code = '';
        const extendedElements = this.getExtendedElements(contentType, snippets, taxonomies);
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
                ${extendedElement.snippet
                ? `, snippetCodename: ${this.getStringOrUndefined(extendedElement.snippet?.codename)}`
                : ''}

            }${!isLast ? ',\n' : ''}`;
        }
        return code;
    }
    getElementOptions(element) {
        if (element.type === 'multiple_choice') {
            let stronglyTypedOptions = `{`;
            for (let i = 0; i < element.options.length; i++) {
                const isLast = i === element.options.length - 1;
                const option = element.options[i];
                stronglyTypedOptions += `${option.codename}: {
                    name: '${textHelper.toSafeName(option.name, 'space')}',
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
    getContentTypeSnippetElements(snippet, taxonomies) {
        let code = '';
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
    getExtendedElements(contentType, snippets, taxonomies) {
        const extendedElements = [];
        for (const element of contentType.elements) {
            if (element.type === 'snippet') {
                // get snippet elements
                const snippetElement = element;
                const snippet = snippets.find((m) => m.id === snippetElement.snippet.id);
                if (!snippet) {
                    throw Error(`Could not find content type snippet with id '${snippetElement.snippet.id}'. This snippet is used in type '${contentType.codename}'`);
                }
                extendedElements.push(...snippet.elements.map((mElement) => {
                    const extendedElement = {
                        element: mElement,
                        snippet: snippet,
                        mappedName: this.getElementName(mElement, taxonomies)
                    };
                    return extendedElement;
                }));
            }
            else {
                extendedElements.push({
                    element: element,
                    snippet: undefined,
                    mappedName: this.getElementName(element, taxonomies)
                });
            }
        }
        return commonHelper.sortAlphabetically(extendedElements, (item) => item.mappedName ?? '');
    }
    getProjectTaxonomies(taxonomies, sortConfig) {
        let code = ``;
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
    getCollections(collections) {
        let code = ``;
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
    getRoles(roles) {
        let code = ``;
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
    getWebhooks(webhooks) {
        let code = ``;
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
    getProjectTaxonomiesTerms(terms, sortConfig) {
        if (terms.length === 0) {
            return `terms: {}`;
        }
        const sortedTerms = sortConfig.sortTaxonomyTerms
            ? commonHelper.sortAlphabetically(terms, (item) => item.name)
            : terms;
        let code = `terms: {`;
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
    getProjectWorkflowSteps(workflow) {
        const steps = [
            {
                codename: workflow.archivedStep.codename,
                id: workflow.archivedStep.id,
                name: workflow.archivedStep.name
            },
            {
                codename: workflow.publishedStep.codename,
                id: workflow.publishedStep.id,
                name: workflow.publishedStep.name
            },
            {
                codename: workflow.scheduledStep.codename,
                id: workflow.scheduledStep.id,
                name: workflow.scheduledStep.name
            }
        ];
        for (const step of workflow.steps) {
            steps.push({
                codename: step.codename,
                id: step.id,
                name: step.name
            });
        }
        const code = `
        {
            ${steps.map((step) => {
            return `
                    ${step.codename}: {
                        name: '${commonHelper.escapeNameValue(step.name)}',
                        codename: '${step.codename}',
                        id: '${step.id}'
                    }
                `;
        })}
        }
        `;
        return code;
    }
}
export const projectGenerator = new ProjectGenerator();
//# sourceMappingURL=project.generator.js.map