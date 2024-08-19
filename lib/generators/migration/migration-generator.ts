import {
    CollectionModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    EnvironmentModels,
    LanguageModels,
    TaxonomyModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { FlattenedElement, getImportStatement, toSafeString, uniqueFilter, GeneratedFile } from '../../core/index.js';
import { textHelper } from '../../text-helper.js';
import { ModuleResolution } from '../../models.js';
import { commentsManager as _commentsManager } from '../../comments/index.js';
import { match } from 'ts-pattern';
import { isNotUndefined } from '@kontent-ai/migration-toolkit';
import { getFlattenedElement } from 'lib/core/element.utils.js';

export interface MigrationGeneratorConfig {
    readonly addTimestamp: boolean;
    readonly addEnvironmentInfo: boolean;
    readonly moduleResolution: ModuleResolution;

    readonly environmentData: {
        readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
        readonly types: readonly ContentTypeModels.ContentType[];
        readonly workflows: readonly WorkflowModels.Workflow[];
        readonly languages: readonly LanguageModels.LanguageModel[];
        readonly collections: readonly CollectionModels.Collection[];
        readonly snippets: readonly ContentTypeSnippetModels.ContentTypeSnippet[];
        readonly taxonomies: readonly TaxonomyModels.Taxonomy[];
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
} as const;

const migrationToolkitNpmPackage = '@kontent-ai/migration-toolkit';

export function migrationGenerator(config: MigrationGeneratorConfig) {
    const commentsManager = _commentsManager(config.addTimestamp);

    const getMigrationItemType = (
        type: Readonly<ContentTypeModels.ContentType>,
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

            /**
            * ${toSafeString(type.name)}
            * 
            * Codename: ${type.codename}
            * Id: ${type.id}
            */
            export type ${textHelper.toPascalCase(type.name)}Item = ${migrationTypeNames.item}<
            '${type.codename}',
            {
                ${getFlattenedElements(type, config.environmentData.snippets, config.environmentData.taxonomies)
                    .map((element) => {
                        return `
                            /**
                            * ${toSafeString(element.title)} (${element.type})
                            * 
                            * Required: ${element.isRequired ? 'true' : 'false'}
                            * Codename: ${element.codename}
                            * Id: ${element.id}${element.guidelines ? `\n* Guidelines: ${textHelper.removeLineEndings(element.guidelines)}` : ''}
                            */
                            ${element.codename}: ${getElementPropType(element)}`;
                    })
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

                ${commentsManager.environmentInfo(config.environmentData.environment)}

                ${commentsManager.wrapComment('Type representing all languages')}
                ${getLanguageCodenamesType(config.environmentData.languages)}

                ${commentsManager.wrapComment('Type representing all content types')}
                ${getContentTypeCodenamesType(config.environmentData.types)}

                ${commentsManager.wrapComment('Type representing all collections')}
                ${getCollectionCodenamesType(config.environmentData.collections)}

                ${commentsManager.wrapComment('Type representing all workflows')}
                ${getWorkflowCodenamesType(config.environmentData.workflows)}

                ${commentsManager.wrapComment('Type representing all worksflow steps across all workflows')}
                ${getWorkflowStepCodenamesType(config.environmentData.workflows)}

                ${commentsManager.wrapComment('System object shared by all individual content type models')}
                ${getSystemType()}

                ${commentsManager.wrapComment('Item object shared by all individual content type models')}
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
    type: Readonly<ContentTypeModels.ContentType>,
    snippets: readonly ContentTypeSnippetModels.ContentTypeSnippet[],
    taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]
): readonly FlattenedElement[] {
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
        })
        .map((element) => {
            return getFlattenedElement(element, taxonomies);
        })
        .filter(isNotUndefined);
}

function getElementPropType(element: Readonly<FlattenedElement>): string {
    return match(element.type)
        .returnType<string>()
        .with('text', () => `${migrationTypeNames.migrationElementModels}.TextElement`)
        .with('asset', () => `${migrationTypeNames.migrationElementModels}.AssetElement`)
        .with('custom', () => `${migrationTypeNames.migrationElementModels}.CustomElement`)
        .with('date_time', () => `${migrationTypeNames.migrationElementModels}.DateTimeElement`)
        .with('rich_text', () => `${migrationTypeNames.migrationElementModels}.RichTextElement`)
        .with('number', () => `${migrationTypeNames.migrationElementModels}.NumberElement`)
        .with('multiple_choice', () => `${migrationTypeNames.migrationElementModels}.MultipleChoiceElement`)
        .with('subpages', () => `${migrationTypeNames.migrationElementModels}.SubpagesElement`)
        .with('taxonomy', () => `${migrationTypeNames.migrationElementModels}.TaxonomyElement`)
        .with('url_slug', () => `${migrationTypeNames.migrationElementModels}.UrlSlugElement`)
        .with('modular_content', () => `${migrationTypeNames.migrationElementModels}.LinkedItemsElement`)
        .otherwise((type) => {
            throw Error(`Element type '${type}' is not supported.`);
        });
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

function getLanguageCodenamesType(languages: readonly LanguageModels.LanguageModel[]): string {
    return `export type ${migrationTypeNames.languageCodenames} = ${languages.map((language) => `'${language.codename}'`).join(' | ')};`;
}

function getContentTypeCodenamesType(types: readonly ContentTypeModels.ContentType[]): string {
    return `export type ${migrationTypeNames.contentTypeCodenames} = ${types.map((type) => `'${type.codename}'`).join(' | ')};`;
}

function getWorkflowCodenamesType(workflows: readonly WorkflowModels.Workflow[]): string {
    return `export type ${migrationTypeNames.workflowCodenames} = ${workflows.map((workflow) => `'${workflow.codename}'`).join(' | ')};`;
}

function getCollectionCodenamesType(collections: readonly CollectionModels.Collection[]): string {
    return `export type ${migrationTypeNames.collectionCodenames} = ${collections.map((collection) => `'${collection.codename}'`).join(' | ')};`;
}

function getWorkflowStepCodenamesType(workflows: readonly WorkflowModels.Workflow[]): string {
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
