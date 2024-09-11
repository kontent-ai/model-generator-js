import { CollectionModels, ContentTypeModels, LanguageModels, WorkflowModels } from '@kontent-ai/management-sdk';
import { sharedTypesConfig } from '../../config.js';
import { uniqueFilter } from '../../core/core.utils.js';

export function getLanguageCodenamesType(languages: readonly Readonly<LanguageModels.LanguageModel>[]): string {
    return `export type ${sharedTypesConfig.languageCodenames} = ${languages.map((language) => `'${language.codename}'`).join(' | ')};`;
}

export function getContentTypeCodenamesType(types: readonly Readonly<ContentTypeModels.ContentType>[]): string {
    return `export type ${sharedTypesConfig.contentTypeCodenames} = ${types.map((type) => `'${type.codename}'`).join(' | ')};`;
}

export function getWorkflowCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return `export type ${sharedTypesConfig.workflowCodenames} = ${workflows.map((workflow) => `'${workflow.codename}'`).join(' | ')};`;
}

export function getCollectionCodenamesType(collections: readonly Readonly<CollectionModels.Collection>[]): string {
    return `export type ${sharedTypesConfig.collectionCodenames} = ${collections.map((collection) => `'${collection.codename}'`).join(' | ')};`;
}

export function getWorkflowStepCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return `export type ${sharedTypesConfig.workflowStepCodenames} = ${workflows
        .flatMap((workflow) => [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep])
        .map((workflowStep) => `'${workflowStep.codename}'`)
        .filter(uniqueFilter)
        .join(' | ')};`;
}
