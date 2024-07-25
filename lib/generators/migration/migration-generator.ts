import {
    CollectionModels,
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    LanguageModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { GeneratedFile } from '../../common-helper.js';
import { getImportStatement, uniqueFilter } from '../../core/index.js';
import { textHelper } from '../../text-helper.js';
import { ModuleResolution } from '../../models.js';

export interface MigrationGeneratorConfig {
    addTimestamp: boolean;
    addEnvironmentInfo: boolean;
    moduleResolution: ModuleResolution;

    environmentData: {
        types: ContentTypeModels.ContentType[];
        workflows: WorkflowModels.Workflow[];
        languages: LanguageModels.LanguageModel[];
        collections: CollectionModels.Collection[];
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
    };
}

const migrationTypeNames = {
    languageCodenames: 'LanguageCodenames',
    collectionCodenames: 'CollectionCodenames',
    workflowCodenames: 'WorkflowCodenames',
    workflowStepCodenames: 'WorkflowStepCodenames',
    contentTypeCodenames: 'ContentTypeCodenames',
    migrationItemSystem: 'MigrationItemSystem',
    migrationElementModels: 'MigrationElementModels',
    migrationItem: 'MigrationItem',
    migrationElements: 'MigrationElements',
    system: 'System',
    item: 'Item',
    codename: 'Codename'
};

const migrationToolkitNpmPackage = '@kontent-ai/migration-toolkit';

export function migrationGenerator(config: MigrationGeneratorConfig) {
    const getMigrationItemType = (
        type: ContentTypeModels.ContentType,
        migrationTypesFilename: string,
        folderName: string
    ): GeneratedFile => {
        return {
            filename: `${folderName}/${type.codename}.ts`,
            text: `
            ${getImportStatement({
                filePathOrPackage: migrationToolkitNpmPackage,
                importValue: migrationTypeNames.migrationElementModels,
                moduleResolution: config.moduleResolution
            })}
             ${getImportStatement({
                 filePathOrPackage: `../${migrationTypesFilename}`,
                 importValue: migrationTypeNames.item,
                 moduleResolution: config.moduleResolution
             })}

            export type ${textHelper.toPascalCase(type.name)}Item = ${migrationTypeNames.item}<
            '${type.codename}',
            {
                ${getFlattenedElements(type, config.environmentData.snippets)
                    .map((element) => `${element.codename}: ${getElementPropType(element)}`)
                    .join(',\n')},
            }
            >;`
        };
    };

    return {
        getMigrationTypesFile(filename: string): GeneratedFile {
            return {
                filename: filename,
                text: `
                  ${getImportStatement({
                      filePathOrPackage: migrationToolkitNpmPackage,
                      importValue: `${migrationTypeNames.migrationItemSystem}, ${migrationTypeNames.migrationItem}, ${migrationTypeNames.migrationElements}`,
                      moduleResolution: config.moduleResolution
                  })}

                ${getLanguageCodenamesType(config.environmentData.languages)}
                ${getContentTypeCodenamesType(config.environmentData.types)}
                ${getCollectionCodenamesType(config.environmentData.collections)}
                ${getWorkflowCodenamesType(config.environmentData.workflows)}
                ${getWorkflowStepCodenamesType(config.environmentData.workflows)}
                ${getSystemType()}
                ${getItemType()}
            `
            };
        },
        getMigrationItemFiles(migrationTypesFilename: string, folderName: string): GeneratedFile[] {
            return config.environmentData.types.map((type) =>
                getMigrationItemType(type, migrationTypesFilename, folderName)
            );
        }
    };
}

function getFlattenedElements(
    type: ContentTypeModels.ContentType,
    snippets: ContentTypeSnippetModels.ContentTypeSnippet[]
): ContentTypeElements.ContentTypeElementModel[] {
    return type.elements
        .filter((element) => {
            if (element.type === 'guidelines') {
                return false;
            }
            return true;
        })
        .flatMap((element) => {
            if (element.type === 'snippet') {
                const snippet = snippets.find((snippet) => snippet.id === element.snippet.id);

                if (!snippet) {
                    throw Error(`Could not find snippet with id '${element.snippet.id}'`);
                }

                return snippet.elements;
            }

            return element;
        });
}

function getElementPropType(element: ContentTypeElements.ContentTypeElementModel): string {
    if (element.type === 'text') {
        return `${migrationTypeNames.migrationElementModels}.TextElement`;
    }
    if (element.type === 'asset') {
        return `${migrationTypeNames.migrationElementModels}.AssetElement`;
    }
    if (element.type === 'custom') {
        return `${migrationTypeNames.migrationElementModels}.CustomElement`;
    }
    if (element.type === 'date_time') {
        return `${migrationTypeNames.migrationElementModels}.DateTimeElement`;
    }
    if (element.type === 'rich_text') {
        return `${migrationTypeNames.migrationElementModels}.RichTextElement`;
    }
    if (element.type === 'number') {
        return `${migrationTypeNames.migrationElementModels}.NumberElement`;
    }
    if (element.type === 'multiple_choice') {
        return `${migrationTypeNames.migrationElementModels}.MultipleChoiceElement`;
    }
    if (element.type === 'subpages') {
        return `${migrationTypeNames.migrationElementModels}.SubpagesElement`;
    }
    if (element.type === 'taxonomy') {
        return `${migrationTypeNames.migrationElementModels}.TaxonomyElement`;
    }
    if (element.type === 'url_slug') {
        return `${migrationTypeNames.migrationElementModels}.UrlSlugElement`;
    }
    if (element.type === 'modular_content') {
        return `${migrationTypeNames.migrationElementModels}.LinkedItemsElement`;
    }

    throw Error(`Element type '${element.type}' is not supported.`);
}

function getItemType(): string {
    return `export type ${migrationTypeNames.item}<
        ${migrationTypeNames.codename} extends ${migrationTypeNames.contentTypeCodenames},
        TElements extends ${migrationTypeNames.migrationElements} = ${migrationTypeNames.migrationElements},
    > = ${migrationTypeNames.migrationItem}<TElements, ${migrationTypeNames.system}<${migrationTypeNames.codename}>, ${migrationTypeNames.workflowStepCodenames}>;`;
}

function getSystemType(): string {
    return `export type ${migrationTypeNames.system}<${migrationTypeNames.codename} extends ${migrationTypeNames.contentTypeCodenames}> = ${migrationTypeNames.migrationItemSystem}<
    ${migrationTypeNames.codename},
    ${migrationTypeNames.languageCodenames},
    ${migrationTypeNames.collectionCodenames},
    ${migrationTypeNames.workflowCodenames}
>;`;
}

function getLanguageCodenamesType(languages: LanguageModels.LanguageModel[]): string {
    return `export type ${migrationTypeNames.languageCodenames} = ${languages.map((language) => `'${language.codename}'`).join(' | ')};`;
}

function getContentTypeCodenamesType(types: ContentTypeModels.ContentType[]): string {
    return `export type ${migrationTypeNames.contentTypeCodenames} = ${types.map((type) => `'${type.codename}'`).join(' | ')};`;
}

function getWorkflowCodenamesType(workflows: WorkflowModels.Workflow[]): string {
    return `export type ${migrationTypeNames.workflowCodenames} = ${workflows.map((workflow) => `'${workflow.codename}'`).join(' | ')};`;
}

function getCollectionCodenamesType(collections: CollectionModels.Collection[]): string {
    return `export type ${migrationTypeNames.collectionCodenames} = ${collections.map((collection) => `'${collection.codename}'`).join(' | ')};`;
}

function getWorkflowStepCodenamesType(workflows: WorkflowModels.Workflow[]): string {
    return `export type ${migrationTypeNames.workflowStepCodenames} = ${workflows
        .flatMap((workflow) => [
            ...workflow.steps,
            workflow.publishedStep,
            workflow.archivedStep,
            workflow.scheduledStep
        ])
        .map((workflowStep) => `'${workflowStep.codename}'`)
        .filter(uniqueFilter)
        .join(' | ')};`;
}
