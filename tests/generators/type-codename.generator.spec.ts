import {
    CollectionModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    LanguageModels,
    TaxonomyModels,
    WorkflowContracts,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { describe, expect, it } from 'vitest';
import { sharedTypesConfig } from '../../lib/config.js';
import { ObjectWithCodename } from '../../lib/core/core.models.js';
import { sortAlphabetically, uniqueFilter } from '../../lib/core/core.utils.js';
import {
    getCollectionCodenamesType,
    getContentTypeCodenamesType,
    getElementCodenamesType,
    getLanguageCodenamesType,
    getTaxonomyCodenamesType,
    getWorkflowCodenamesType,
    getWorkflowStepCodenamesType
} from '../../lib/generators/shared/type-codename.generator.js';

type GeneratorTypeRecord = {
    readonly getTypes: <T extends Readonly<ObjectWithCodename>>(items: readonly T[]) => string;
    readonly propertyName: string;
    readonly sampleItems: readonly Readonly<ObjectWithCodename>[];
    readonly expectedTypeItems: readonly string[];
};

const generatorTypeRecords: readonly GeneratorTypeRecord[] = [
    {
        getTypes: (items) => getLanguageCodenamesType(items as unknown as readonly Readonly<LanguageModels.LanguageModel>[]),
        propertyName: sharedTypesConfig.languageCodenames,
        sampleItems: ['c', 'a', 'b', 'c'].map((codename) => ({ codename })),
        expectedTypeItems: ['a', 'b', 'c']
    },
    {
        getTypes: (items) => getCollectionCodenamesType(items as unknown as readonly Readonly<CollectionModels.Collection>[]),
        propertyName: sharedTypesConfig.collectionCodenames,
        sampleItems: ['c', 'a', 'b', 'c'].map((codename) => ({ codename })),
        expectedTypeItems: ['a', 'b', 'c']
    },
    {
        getTypes: (items) => getContentTypeCodenamesType(items as unknown as readonly Readonly<ContentTypeModels.ContentType>[]),
        propertyName: sharedTypesConfig.contentTypeCodenames,
        sampleItems: ['c', 'a', 'b', 'c'].map((codename) => ({ codename })),
        expectedTypeItems: ['a', 'b', 'c']
    },
    {
        getTypes: (items) => getTaxonomyCodenamesType(items as unknown as readonly Readonly<TaxonomyModels.Taxonomy>[]),
        propertyName: sharedTypesConfig.taxonomyCodenames,
        sampleItems: ['c', 'a', 'b', 'c'].map((codename) => ({ codename })),
        expectedTypeItems: ['a', 'b', 'c']
    },
    {
        getTypes: (items) => getWorkflowCodenamesType(items as unknown as readonly Readonly<WorkflowModels.Workflow>[]),
        propertyName: sharedTypesConfig.workflowCodenames,
        sampleItems: ['c', 'a', 'b', 'c'].map<Partial<WorkflowModels.Workflow> & ObjectWithCodename>((codename, index) => ({
            codename: codename,
            steps: [
                {
                    codename: `${index}${codename}`
                }
            ] as unknown as WorkflowContracts.IWorkflowStepNewContract[]
        })),
        expectedTypeItems: ['a', 'b', 'c']
    },
    {
        getTypes: (items) => getWorkflowStepCodenamesType(items as unknown as readonly Readonly<WorkflowModels.Workflow>[]),
        propertyName: sharedTypesConfig.workflowStepCodenames,
        sampleItems: ['c', 'a', 'b'].map<Partial<WorkflowModels.Workflow> & ObjectWithCodename>((codename, index) => ({
            codename: codename,
            archivedStep: {
                codename: 'archived'
            } as WorkflowContracts.IWorkflowArchivedStepContract,
            publishedStep: {
                codename: 'published'
            } as WorkflowContracts.IWorkflowPublishedStepContract,
            scheduledStep: {
                codename: 'scheduled'
            } as WorkflowContracts.IWorkflowScheduledStepContract,
            steps: [
                {
                    codename: `${index}${codename}`
                }
            ] as unknown as WorkflowContracts.IWorkflowStepNewContract[]
        })),
        expectedTypeItems: ['0c', '1a', '2b', 'archived', 'published', 'scheduled']
    }
];

describe(`Type codenames generators`, () => {
    for (const generatorTypeRecord of generatorTypeRecords) {
        it(`${generatorTypeRecord.propertyName} - Empty array should resolve to type 'never'`, () => {
            expect(generatorTypeRecord.getTypes([])).toStrictEqual(`export type ${generatorTypeRecord.propertyName} = never`);
        });

        it(`${generatorTypeRecord.propertyName} - Correct type with values should be generated`, () => {
            expect(generatorTypeRecord.getTypes(generatorTypeRecord.sampleItems)).toStrictEqual(
                `export type ${generatorTypeRecord.propertyName} = ${generatorTypeRecord.expectedTypeItems.map((codename) => `'${codename}'`).join(' | ')};`
            );
        });
    }
});

describe(`Element codenames generators`, () => {
    it(`Empty array should resolve to type 'never'`, () => {
        expect(getElementCodenamesType([], [])).toStrictEqual(`export type ${sharedTypesConfig.elementCodenames} = never`);
    });

    it(`Unique element codenames accross types & snippets`, () => {
        const typeElementCodenames: readonly string[] = ['a', 'b', 'c', 'a', 'b', 'c'];
        const snippetsElementCodenames: readonly string[] = ['d', 'f', 'c', 'a', 'g', 'a'];

        expect(
            getElementCodenamesType(
                [
                    {
                        elements: typeElementCodenames.map((codename) => ({ codename }))
                    }
                ] as Readonly<ContentTypeModels.ContentType>[],
                [
                    {
                        elements: snippetsElementCodenames.map((codename) => ({ codename }))
                    }
                ] as Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]
            )
        ).toStrictEqual(
            `export type ${sharedTypesConfig.elementCodenames} = ${sortAlphabetically(
                [...snippetsElementCodenames, ...typeElementCodenames],
                (m) => m
            )
                .filter(uniqueFilter)
                .map((codename) => `'${codename}'`)
                .join(' | ')};`
        );
    });
});
