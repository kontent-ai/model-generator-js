import {
    CollectionModels,
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    LanguageModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { GeneratedFile } from '../../common-helper.js';
import { replaceTsExtensionWithJs, uniqueFilter } from '../../core/index.js';
import { textHelper } from '../../text-helper.js';

export interface MigrationGeneratorConfig {
    addTimestamp: boolean;
    addEnvironmentInfo: boolean;

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
    contentTypeCodename: 'ContentTypeCodename'
};

const migrationImportTypes = {
    migrationItemSystem: 'MigrationItemSystem',
    migrationElementModels: 'MigrationElementModels',
    migrationItem: 'MigrationItem',
    system: 'System',
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
            import {${migrationImportTypes.migrationItem}, ${migrationImportTypes.migrationElementModels}} from '${migrationToolkitNpmPackage}';
            import {${migrationImportTypes.system}, ${migrationTypeNames.workflowStepCodenames}} from '../${replaceTsExtensionWithJs(migrationTypesFilename)}';

            export type ${textHelper.toPascalCase(type.name)}Item = ${migrationImportTypes.migrationItem}<
            {
                ${getFlattenedElements(type, config.environmentData.snippets)
                    .map((element) => `${element.codename}: ${getElementPropType(element)}`)
                    .join(',\n')},
            },
            ${migrationImportTypes.system}<'${type.codename}'>,
            ${migrationTypeNames.workflowStepCodenames}
            >;`
        };
    };

    return {
        getMigrationTypesFile(filename: string): GeneratedFile {
            return {
                filename: filename,
                text: `
                  import {${migrationImportTypes.migrationItemSystem}} from '${migrationToolkitNpmPackage}';

                ${getLanguageCodenamesType(config.environmentData.languages)}
                ${getContentTypeCodenamesType(config.environmentData.types)}
                ${getCollectionCodenamesType(config.environmentData.collections)}
                ${getWorkflowCodenamesType(config.environmentData.workflows)}
                ${getWorkflowStepCodenamesType(config.environmentData.workflows)}
                ${getSystemType()}
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
        return `${migrationImportTypes.migrationElementModels}.TextElement`;
    }
    if (element.type === 'asset') {
        return `${migrationImportTypes.migrationElementModels}.AssetElement`;
    }
    if (element.type === 'custom') {
        return `${migrationImportTypes.migrationElementModels}.CustomElement`;
    }
    if (element.type === 'date_time') {
        return `${migrationImportTypes.migrationElementModels}.DateTimeElement`;
    }
    if (element.type === 'rich_text') {
        return `${migrationImportTypes.migrationElementModels}.RichTextElement`;
    }
    if (element.type === 'number') {
        return `${migrationImportTypes.migrationElementModels}.NumberElement`;
    }
    if (element.type === 'multiple_choice') {
        return `${migrationImportTypes.migrationElementModels}.MultipleChoiceElement`;
    }
    if (element.type === 'subpages') {
        return `${migrationImportTypes.migrationElementModels}.SubpagesElement`;
    }
    if (element.type === 'taxonomy') {
        return `${migrationImportTypes.migrationElementModels}.TaxonomyElement`;
    }
    if (element.type === 'url_slug') {
        return `${migrationImportTypes.migrationElementModels}.UrlSlugElement`;
    }
    if (element.type === 'modular_content') {
        return `${migrationImportTypes.migrationElementModels}.LinkedItemsElement`;
    }

    throw Error(`Element type '${element.type}' is not supported.`);
}

function getSystemType(): string {
    return `export type ${migrationImportTypes.system}<${migrationImportTypes.codename} extends ${migrationTypeNames.contentTypeCodenames}> = ${migrationImportTypes.migrationItemSystem}<
    ${migrationImportTypes.codename},
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
