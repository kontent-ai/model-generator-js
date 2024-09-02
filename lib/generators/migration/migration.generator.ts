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
    uniqueFilter,
    GeneratedFile,
    toSafeString,
    toPascalCase,
    getFlattenedElements,
    migrationConfig,
    ModuleResolution,
    importer as _importer,
    toGuidelinesComment
} from '../../core/index.js';
import { commentsManager as _commentsManager } from '../../comments/index.js';

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
    const commentsManager = _commentsManager();
    const importer = _importer(config.moduleResolution);

    const getMigrationItemType = (type: Readonly<ContentTypeModels.ContentType>): GeneratedFile => {
        return {
            filename: `${migrationConfig.migrationItemsFolderName}/${type.codename}.ts`,
            text: `
            ${importer.importType({
                filePathOrPackage: migrationConfig.npmPackageName,
                importValue: migrationConfig.typeNames.migrationElementModels
            })}
             ${importer.importType({
                 filePathOrPackage: `../${migrationConfig.migrationTypesFilename}`,
                 importValue: migrationConfig.typeNames.item
             })}

            /**
            * ${toSafeString(type.name)}
            * 
            * Codename: ${type.codename}
            * Id: ${type.id}
            */
            export type ${toPascalCase(type.name)}Item = ${migrationConfig.typeNames.item}<
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
                            * Id: ${element.id}${element.guidelines ? `\n* Guidelines: ${toGuidelinesComment(element.guidelines)}` : ''}
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
                  ${importer.importType({
                      filePathOrPackage: migrationConfig.npmPackageName,
                      importValue: `${migrationConfig.typeNames.migrationItemSystem}, ${migrationConfig.typeNames.migrationItem}, ${migrationConfig.typeNames.migrationElements}`
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
        .with('text', () => `${migrationConfig.typeNames.migrationElementModels}.TextElement`)
        .with('asset', () => `${migrationConfig.typeNames.migrationElementModels}.AssetElement`)
        .with('custom', () => `${migrationConfig.typeNames.migrationElementModels}.CustomElement`)
        .with('date_time', () => `${migrationConfig.typeNames.migrationElementModels}.DateTimeElement`)
        .with('rich_text', () => `${migrationConfig.typeNames.migrationElementModels}.RichTextElement`)
        .with('number', () => `${migrationConfig.typeNames.migrationElementModels}.NumberElement`)
        .with('multiple_choice', () => `${migrationConfig.typeNames.migrationElementModels}.MultipleChoiceElement`)
        .with('subpages', () => `${migrationConfig.typeNames.migrationElementModels}.SubpagesElement`)
        .with('taxonomy', () => `${migrationConfig.typeNames.migrationElementModels}.TaxonomyElement`)
        .with('url_slug', () => `${migrationConfig.typeNames.migrationElementModels}.UrlSlugElement`)
        .with('modular_content', () => `${migrationConfig.typeNames.migrationElementModels}.LinkedItemsElement`)
        .otherwise((type) => {
            throw Error(`Element type '${type}' is not supported.`);
        });
}

function getItemType(): string {
    return `export type ${migrationConfig.typeNames.item}<
        ${migrationConfig.typeNames.codename} extends ${migrationConfig.typeNames.contentTypeCodenames},
        TElements extends ${migrationConfig.typeNames.migrationElements} = ${migrationConfig.typeNames.migrationElements},
    > = ${migrationConfig.typeNames.migrationItem}<TElements, ${migrationConfig.typeNames.system}<${migrationConfig.typeNames.codename}>, ${migrationConfig.typeNames.workflowStepCodenames}>;`;
}

function getSystemType(): string {
    return `export type ${migrationConfig.typeNames.system}<${migrationConfig.typeNames.codename} extends ${migrationConfig.typeNames.contentTypeCodenames}> = ${migrationConfig.typeNames.migrationItemSystem}<
    ${migrationConfig.typeNames.codename},
    ${migrationConfig.typeNames.languageCodenames},
    ${migrationConfig.typeNames.collectionCodenames},
    ${migrationConfig.typeNames.workflowCodenames}
>;`;
}

function getLanguageCodenamesType(languages: readonly Readonly<LanguageModels.LanguageModel>[]): string {
    return `export type ${migrationConfig.typeNames.languageCodenames} = ${languages.map((language) => `'${language.codename}'`).join(' | ')};`;
}

function getContentTypeCodenamesType(types: readonly Readonly<ContentTypeModels.ContentType>[]): string {
    return `export type ${migrationConfig.typeNames.contentTypeCodenames} = ${types.map((type) => `'${type.codename}'`).join(' | ')};`;
}

function getWorkflowCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return `export type ${migrationConfig.typeNames.workflowCodenames} = ${workflows.map((workflow) => `'${workflow.codename}'`).join(' | ')};`;
}

function getCollectionCodenamesType(collections: readonly Readonly<CollectionModels.Collection>[]): string {
    return `export type ${migrationConfig.typeNames.collectionCodenames} = ${collections.map((collection) => `'${collection.codename}'`).join(' | ')};`;
}

function getWorkflowStepCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return `export type ${migrationConfig.typeNames.workflowStepCodenames} = ${workflows
        .flatMap((workflow) => [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep])
        .map((workflowStep) => `'${workflowStep.codename}'`)
        .filter(uniqueFilter)
        .join(' | ')};`;
}
