import {
    CollectionModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    EnvironmentModels,
    LanguageModels,
    TaxonomyModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { match } from 'ts-pattern';
import { migrationConfig, sharedTypesConfig } from '../../config.js';
import { wrapComment } from '../../core/comment.utils.js';
import { FlattenedElement, GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { toGuidelinesComment, toPascalCase } from '../../core/core.utils.js';
import { getFlattenedElements } from '../../core/element.utils.js';
import { importer as _importer } from '../../core/importer.js';
import {
    getCollectionCodenamesType,
    getContentTypeCodenamesType,
    getLanguageCodenamesType,
    getWorkflowCodenamesType,
    getWorkflowStepCodenamesType
} from '../shared/type-codename.generator.js';

export interface MigrationGeneratorConfig {
    readonly moduleFileExtension: ModuleFileExtension;

    readonly environmentData: {
        readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
        readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
        readonly workflows: readonly Readonly<WorkflowModels.Workflow>[];
        readonly languages: readonly Readonly<LanguageModels.LanguageModel>[];
        readonly collections: readonly Readonly<CollectionModels.Collection>[];
        readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[];
        readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
    };
}

export function migrationGenerator(config: MigrationGeneratorConfig) {
    const importer = _importer(config.moduleFileExtension);

    const getMigrationItemType = (type: Readonly<ContentTypeModels.ContentType>): GeneratedFile => {
        return {
            filename: `${type.codename}.ts`,
            text: `
            ${importer.importType({
                filePathOrPackage: migrationConfig.npmPackageName,
                importValue: migrationConfig.sdkTypeNames.elementModels
            })}
             ${importer.importType({
                 filePathOrPackage: `../${migrationConfig.migrationTypesFilename}.ts`,
                 importValue: migrationConfig.localTypeNames.item
             })}

            ${wrapComment(`
            * ${type.name}
            * 
            * Codename: ${type.codename}
            * Id: ${type.id}
            `)}
            export type ${toPascalCase(type.name)}Item = ${migrationConfig.localTypeNames.item}<
            '${type.codename}',
            {
                ${getFlattenedElements({
                    elements: type.elements,
                    snippets: config.environmentData.snippets,
                    taxonomies: config.environmentData.taxonomies,
                    types: config.environmentData.types
                })
                    .map((element) => {
                        return `
                            ${wrapComment(`
                            * ${element.title}
                            * 
                            * Type: ${element.type} 
                            * Required: ${element.isRequired ? 'true' : 'false'}
                            * Codename: ${element.codename}
                            * Id: ${element.id}${element.guidelines ? `\n* Guidelines: ${toGuidelinesComment(element.guidelines)}` : ''}
                            `)}
                            readonly ${element.codename}: ${getElementPropType(element)}`;
                    })
                    .join(',\n')},
            }
            >;`
        };
    };

    return {
        getEnvironmentFiles(): GeneratedSet {
            return {
                folderName: migrationConfig.environmentFolderName,
                files: [
                    {
                        filename: `${migrationConfig.environmentFilename}.ts`,
                        text: `
                ${wrapComment(`\n * Type representing all languages\n`)}
                ${getLanguageCodenamesType(config.environmentData.languages)}

                ${wrapComment(`\n * Type representing all content types\n`)}
                ${getContentTypeCodenamesType(config.environmentData.types)}

                ${wrapComment(`\n * Type representing all collections\n`)}
                ${getCollectionCodenamesType(config.environmentData.collections)}

                ${wrapComment(`\n * Type representing all workflows\n`)}
                ${getWorkflowCodenamesType(config.environmentData.workflows)}

                ${wrapComment(`\n * Type representing all worksflow steps across all workflows\n`)}
                ${getWorkflowStepCodenamesType(config.environmentData.workflows)}
            `
                    }
                ]
            };
        },
        getMigrationTypeFiles(): GeneratedSet {
            return {
                folderName: undefined,
                files: [
                    {
                        filename: `${migrationConfig.migrationTypesFilename}.ts`,
                        text: `
                  ${importer.importType({
                      filePathOrPackage: migrationConfig.npmPackageName,
                      importValue: `${migrationConfig.sdkTypeNames.item}, ${migrationConfig.sdkTypeNames.system}, ${migrationConfig.sdkTypeNames.elements}`
                  })}
                   ${importer.importType({
                       filePathOrPackage: `./${migrationConfig.environmentFolderName}/${migrationConfig.environmentFilename}.ts`,
                       importValue: `${sharedTypesConfig.collectionCodenames}, ${sharedTypesConfig.contentTypeCodenames}, ${sharedTypesConfig.languageCodenames}, ${sharedTypesConfig.workflowCodenames}, ${sharedTypesConfig.workflowStepCodenames}`
                   })}

                ${wrapComment('\n * System object shared by all individual content type models\n')}
                ${getSystemType()}

                ${wrapComment('\n * Item object shared by all individual content type models\n')}
                ${getItemType()}
            `
                    }
                ]
            };
        },
        getMigrationItemFiles(): GeneratedSet {
            return {
                folderName: migrationConfig.migrationItemsFolderName,
                files: config.environmentData.types.map((type) => getMigrationItemType(type))
            };
        }
    };
}

function getElementPropType(element: Readonly<FlattenedElement>): string {
    return match(element.type)
        .returnType<string>()
        .with('text', () => `${migrationConfig.sdkTypeNames.elementModels}.TextElement`)
        .with('asset', () => `${migrationConfig.sdkTypeNames.elementModels}.AssetElement`)
        .with('custom', () => `${migrationConfig.sdkTypeNames.elementModels}.CustomElement`)
        .with('date_time', () => `${migrationConfig.sdkTypeNames.elementModels}.DateTimeElement`)
        .with('rich_text', () => `${migrationConfig.sdkTypeNames.elementModels}.RichTextElement`)
        .with('number', () => `${migrationConfig.sdkTypeNames.elementModels}.NumberElement`)
        .with('multiple_choice', () => `${migrationConfig.sdkTypeNames.elementModels}.MultipleChoiceElement`)
        .with('subpages', () => `${migrationConfig.sdkTypeNames.elementModels}.SubpagesElement`)
        .with('taxonomy', () => `${migrationConfig.sdkTypeNames.elementModels}.TaxonomyElement`)
        .with('url_slug', () => `${migrationConfig.sdkTypeNames.elementModels}.UrlSlugElement`)
        .with('modular_content', () => `${migrationConfig.sdkTypeNames.elementModels}.LinkedItemsElement`)
        .with('guidelines', () => {
            throw new Error('Guidelines are not supported');
        })
        .with('snippet', () => {
            throw new Error('Snippets are not supported');
        })
        .exhaustive();
}

function getItemType(): string {
    return `export type ${migrationConfig.localTypeNames.item}<
        ${migrationConfig.localTypeNames.codename} extends ${sharedTypesConfig.contentTypeCodenames},
        ${migrationConfig.localTypeNames.elements} extends ${migrationConfig.sdkTypeNames.elements} = ${migrationConfig.sdkTypeNames.elements},
    > = ${migrationConfig.sdkTypeNames.item}<${migrationConfig.localTypeNames.elements}, ${migrationConfig.localTypeNames.system}<${migrationConfig.localTypeNames.codename}>, ${sharedTypesConfig.workflowStepCodenames}>;`;
}

function getSystemType(): string {
    return `export type ${migrationConfig.localTypeNames.system}<${migrationConfig.localTypeNames.codename} extends ${sharedTypesConfig.contentTypeCodenames}> = ${migrationConfig.sdkTypeNames.system}<
    ${migrationConfig.localTypeNames.codename},
    ${sharedTypesConfig.languageCodenames},
    ${sharedTypesConfig.collectionCodenames},
    ${sharedTypesConfig.workflowCodenames}
>;`;
}
