import { CollectionModels, ContentTypeModels, LanguageModels, WorkflowModels } from '@kontent-ai/management-sdk';
import { sharedTypesConfig } from '../../config.js';
import { ObjectWithCodename } from '../../core/core.models.js';
import { uniqueFilter } from '../../core/core.utils.js';

export function getLanguageCodenamesType(languages: readonly Readonly<LanguageModels.LanguageModel>[]): string {
    return getTypeWithCodenames(sharedTypesConfig.languageCodenames, languages);
}

export function getContentTypeCodenamesType(types: readonly Readonly<ContentTypeModels.ContentType>[]): string {
    return getTypeWithCodenames(sharedTypesConfig.contentTypeCodenames, types);
}

export function getWorkflowCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return getTypeWithCodenames(sharedTypesConfig.workflowCodenames, workflows);
}

export function getCollectionCodenamesType(collections: readonly Readonly<CollectionModels.Collection>[]): string {
    return getTypeWithCodenames(sharedTypesConfig.collectionCodenames, collections);
}

export function getWorkflowStepCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return getTypeWithCodenames(
        sharedTypesConfig.workflowStepCodenames,
        workflows.flatMap((workflow) => [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep])
    );
}

function getTypeWithCodenames(typeName: string, items: readonly ObjectWithCodename[]): string {
    return `export type ${typeName} = ${items
        .map((item) => `'${item.codename}'`)
        .filter(uniqueFilter)
        .join(' | ')};`;
}
