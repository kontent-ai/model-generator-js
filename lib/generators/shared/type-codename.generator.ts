import type { ContentTypeModels, ContentTypeSnippetModels, WorkflowModels } from '@kontent-ai/management-sdk';
import { match, P } from 'ts-pattern';
import { sharedTypesConfig } from '../../config.js';
import type { ObjectWithCodename } from '../../core/core.models.js';
import { isNotUndefined, sortAlphabetically, uniqueFilter } from '../../core/core.utils.js';

export function getWorkflowStepCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
    return getTypeWithCodenames(
        sharedTypesConfig.workflowStepCodenames,
        workflows.flatMap((workflow) => [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep])
    );
}

export function getElementCodenamesType(
    types: readonly Readonly<ContentTypeModels.ContentType>[],
    snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]
): string {
    return getTypeWithCodenames(
        sharedTypesConfig.elementCodenames,
        [...types, ...snippets].flatMap((type) =>
            type.elements
                .map((element) =>
                    match(element)
                        .returnType<ObjectWithCodename | undefined>()
                        .with({ codename: P.nonNullable }, (elementWithCodename) => {
                            return elementWithCodename;
                        })
                        .otherwise(() => undefined)
                )
                .filter(isNotUndefined)
        )
    );
}

export function getTypeWithCodenames(typeName: string, items: readonly ObjectWithCodename[]): string {
    if (!items.length) {
        return `export type ${typeName} = never`;
    }
    return `export type ${typeName} = ${sortAlphabetically(items.map((item) => `'${item.codename}'`).filter(uniqueFilter), (m) => m).join(
        ' | '
    )};`;
}
