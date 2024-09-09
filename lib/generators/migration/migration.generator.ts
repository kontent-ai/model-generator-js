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
import { migrationConfig } from '../../config.js';
import {
    importer as _importer,
    FlattenedElement,
    GeneratedFile,
    getFlattenedElements,
    ModuleResolution,
    toGuidelinesComment,
    toPascalCase,
    uniqueFilter,
    wrapComment
} from '../../core/index.js';

export interface MigrationGeneratorConfig {
    readonly moduleResolution: ModuleResolution;

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
    const importer = _importer(config.moduleResolution);

    const getMigrationItemType = (type: Readonly<ContentTypeModels.ContentType>): GeneratedFile => {
        return {
            filename: `${migrationConfig.migrationItemsFolderName}/${type.codename}.ts`,
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
                ${getFlattenedElements(
                    type.elements,
                    config.environmentData.snippets,
                    config.environmentData.taxonomies,
                    config.environmentData.types
                )
                    .map((element) => {
                        return `
                            ${wrapComment(`
                            * ${element.title} (${element.type})
                            * 
                            * Required: ${element.isRequired ? 'true' : 'false'}
                            * Codename: ${element.codename}
                            * Id: ${element.id}${element.guidelines ? `\n* Guidelines: ${toGuidelinesComment(element.guidelines)}` : ''}
                            `)}
                            ${element.codename}: ${getElementPropType(element)}`;
                    })
                    .join(',\n')},
            }
            >;`
        };
    };

    return {
        getEnvironmentFiles(): readonly GeneratedFile[] {
            return [
                {
                    filename: `${migrationConfig.environmentFolderName}/${migrationConfig.environmentFilename}.ts`,
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
            ];
        },
        getMigrationTypeFiles(): readonly GeneratedFile[] {
            return [
                {
                    filename: `${migrationConfig.migrationTypesFilename}.ts`,
                    text: `
                  ${importer.importType({
                      filePathOrPackage: migrationConfig.npmPackageName,
                      importValue: `${migrationConfig.sdkTypeNames.item}, ${migrationConfig.sdkTypeNames.system}, ${migrationConfig.sdkTypeNames.elements}`
                  })}
                   ${importer.importType({
                       filePathOrPackage: `./${migrationConfig.environmentFolderName}/${migrationConfig.environmentFilename}.ts`,
                       importValue: `${migrationConfig.localTypeNames.collectionCodenames}, ${migrationConfig.localTypeNames.contentTypeCodenames}, ${migrationConfig.localTypeNames.languageCodenames}, ${migrationConfig.localTypeNames.workflowCodenames}, ${migrationConfig.localTypeNames.workflowStepCodenames}`
                   })}

                ${wrapComment('System object shared by all individual content type models')}
                ${getSystemType()}

                ${wrapComment('Item object shared by all individual content type models')}
                ${getItemType()}
            `
                }
            ];
        },
        getMigrationItemFiles(): readonly GeneratedFile[] {
            return config.environmentData.types.map((type) => getMigrationItemType(type));
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
        ${migrationConfig.localTypeNames.codename} extends ${migrationConfig.localTypeNames.contentTypeCodenames},
        ${migrationConfig.localTypeNames.elements} extends ${migrationConfig.sdkTypeNames.elements} = ${migrationConfig.sdkTypeNames.elements},
    > = ${migrationConfig.sdkTypeNames.item}<${migrationConfig.localTypeNames.elements}, ${migrationConfig.localTypeNames.system}<${migrationConfig.localTypeNames.codename}>, ${migrationConfig.localTypeNames.workflowStepCodenames}>;`;
}

function getSystemType(): string {
    return `export type ${migrationConfig.localTypeNames.system}<${migrationConfig.localTypeNames.codename} extends ${migrationConfig.localTypeNames.contentTypeCodenames}> = ${migrationConfig.sdkTypeNames.system}<
    ${migrationConfig.localTypeNames.codename},
    ${migrationConfig.localTypeNames.languageCodenames},
    ${migrationConfig.localTypeNames.collectionCodenames},
    ${migrationConfig.localTypeNames.workflowCodenames}
>;`;
}

function getLanguageCodenamesType(languages: readonly Readonly<LanguageModels.LanguageModel>[]): string {
    return `export type ${migrationConfig.localTypeNames.languageCodenames} = ${languages.map((language) => `'${language.codename}'`).join(' | ')};`;
}

function getContentTypeCodenamesType(types: readonly Readonly<ContentTypeModels.ContentType>[]): string {
    return `export type ${migrationConfig.localTypeNames.contentTypeCodenames} = ${types.map((type) => `'${type.codename}'`).join(' | ')};`;
}

function getWorkflowCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return `export type ${migrationConfig.localTypeNames.workflowCodenames} = ${workflows.map((workflow) => `'${workflow.codename}'`).join(' | ')};`;
}

function getCollectionCodenamesType(collections: readonly Readonly<CollectionModels.Collection>[]): string {
    return `export type ${migrationConfig.localTypeNames.collectionCodenames} = ${collections.map((collection) => `'${collection.codename}'`).join(' | ')};`;
}

function getWorkflowStepCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return `export type ${migrationConfig.localTypeNames.workflowStepCodenames} = ${workflows
        .flatMap((workflow) => [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep])
        .map((workflowStep) => `'${workflowStep.codename}'`)
        .filter(uniqueFilter)
        .join(' | ')};`;
}
