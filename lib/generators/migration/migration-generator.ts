import {
    CollectionModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    LanguageModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { GeneratedFile } from '../../common-helper.js';
import { uniqueFilter } from '../../core/index.js';

export interface MigrationGeneratorConfig {
    addTimestamp: boolean;
    addEnvironmentInfo: boolean;
    outputDir: string;

    environmentData: {
        types: ContentTypeModels.ContentType[];
        workflows: WorkflowModels.Workflow[];
        languages: LanguageModels.LanguageModel[];
        collections: CollectionModels.Collection[];
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
    };
}

export function migrationGenerator(config: MigrationGeneratorConfig) {
    return {
        getMigrationTypesFile(filename: string): GeneratedFile {
            return {
                filepath: config.outputDir + filename,
                filename: filename,
                text: `
                ${getLanguageCodenamesType(config.environmentData.languages)}
                ${getContentTypeCodenamesType(config.environmentData.types)}
                ${getContentTypeCodenameType()}
                ${getCollectionCodenamesType(config.environmentData.collections)}
                ${getWorkflowCodenamesType(config.environmentData.workflows)}
                ${getWorkflowStepCodenamesType(config.environmentData.workflows)}
            `
            };
        },
        getmigrationItemFiles(): GeneratedFile[] {
            return [];
        }
    };
}

function getLanguageCodenamesType(languages: LanguageModels.LanguageModel[]): string {
    return `export type LanguageCodenames = ${languages.map((language) => `'${language.codename}'`).join(' | ')};`;
}

function getContentTypeCodenameType(): string {
    return `export type ContentTypeCodename<Codename extends ContentTypeCodenames> = Codename;`;
}

function getContentTypeCodenamesType(types: ContentTypeModels.ContentType[]): string {
    return `export type ContentTypeCodenames = ${types.map((type) => `'${type.codename}'`).join(' | ')};`;
}

function getWorkflowCodenamesType(workflows: WorkflowModels.Workflow[]): string {
    return `export type WorkflowCodenames = ${workflows.map((workflow) => `'${workflow.codename}'`).join(' | ')};`;
}

function getCollectionCodenamesType(collections: CollectionModels.Collection[]): string {
    return `export type CollectionCodenames = ${collections.map((collection) => `'${collection.codename}'`).join(' | ')};`;
}

function getWorkflowStepCodenamesType(workflows: WorkflowModels.Workflow[]): string {
    return `export type WorkflowStepCodenames = ${workflows
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
