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
import {
    FlattenedElement,
    getImportStatement,
    uniqueFilter,
    GeneratedFile,
    toSafeString,
    removeLineEndings,
    toPascalCase,
    getFlattenedElements,
    migrationConfig,
    ModuleResolution
} from '../../core/index.js';
import { commentsManager as _commentsManager } from '../../comments/index.js';

export interface MigrationGeneratorConfig {
    readonly addTimestamp: boolean;
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

export function migrationGenerator(config: MigrationGeneratorConfig) {
    const commentsManager = _commentsManager();

    const getMigrationItemType = (type: Readonly<ContentTypeModels.ContentType>): GeneratedFile => {
        return {
            filename: `${migrationConfig.migrationItemsFolderName}/${type.codename}.ts`,
            text: `
            ${getImportStatement({
                filePathOrPackage: migrationConfig.npmPackageName,
                importValue: migrationTypeNames.migrationElementModels,
                moduleResolution: config.moduleResolution
            })}
             ${getImportStatement({
                 filePathOrPackage: `../${migrationConfig.migrationTypesFilename}`,
                 importValue: migrationTypeNames.item,
                 moduleResolution: config.moduleResolution
             })}

            /**
            * ${toSafeString(type.name)}
            * 
            * Codename: ${type.codename}
            * Id: ${type.id}
            */
            export type ${toPascalCase(type.name)}Item = ${migrationTypeNames.item}<
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
                            /**
                            * ${toSafeString(element.title)} (${element.type})
                            * 
                            * Required: ${element.isRequired ? 'true' : 'false'}
                            * Codename: ${element.codename}
                            * Id: ${element.id}${element.guidelines ? `\n* Guidelines: ${toSafeString(removeLineEndings(element.guidelines))}` : ''}
                            */
                            ${element.codename}: ${getElementPropType(element)}`;
                    })
                    .join(',\n')},
            }
            >;`
        };
    };

    return {
        getMigrationTypesFile(): GeneratedFile {
            return {
                filename: migrationConfig.migrationTypesFilename,
                text: `
                  ${getImportStatement({
                      filePathOrPackage: migrationConfig.npmPackageName,
                      importValue: `${migrationTypeNames.migrationItemSystem}, ${migrationTypeNames.migrationItem}, ${migrationTypeNames.migrationElements}`,
                      moduleResolution: config.moduleResolution
                  })}

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
        getMigrationItemFiles(): readonly GeneratedFile[] {
            return config.environmentData.types.map((type) => getMigrationItemType(type));
        }
    };
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

function getLanguageCodenamesType(languages: readonly Readonly<LanguageModels.LanguageModel>[]): string {
    return `export type ${migrationTypeNames.languageCodenames} = ${languages.map((language) => `'${language.codename}'`).join(' | ')};`;
}

function getContentTypeCodenamesType(types: readonly Readonly<ContentTypeModels.ContentType>[]): string {
    return `export type ${migrationTypeNames.contentTypeCodenames} = ${types.map((type) => `'${type.codename}'`).join(' | ')};`;
}

function getWorkflowCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return `export type ${migrationTypeNames.workflowCodenames} = ${workflows.map((workflow) => `'${workflow.codename}'`).join(' | ')};`;
}

function getCollectionCodenamesType(collections: readonly Readonly<CollectionModels.Collection>[]): string {
    return `export type ${migrationTypeNames.collectionCodenames} = ${collections.map((collection) => `'${collection.codename}'`).join(' | ')};`;
}

function getWorkflowStepCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
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
