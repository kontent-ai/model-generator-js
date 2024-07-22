import {
    CollectionModels,
    ContentTypeModels,
    ContentTypeSnippetModels,
    LanguageModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { IGeneratedFile } from '../../common-helper.js';

export interface MigrationGeneratorConfig {
    addTimestamp: boolean;
    addEnvironmentInfo: boolean;

    types: ContentTypeModels.ContentType[];
    workflows: WorkflowModels.Workflow[];
    languages: LanguageModels.LanguageModel[];
    collections: CollectionModels.Collection[];
    snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
}

export function migrationGenerator(config: MigrationGeneratorConfig) {
    console.log(config);
    return {
        generate(): IGeneratedFile[] {
            return [];
        }
    };
}
