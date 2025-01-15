import { IGeneratedFile } from '../../common-helper.js';
import { ContentTypeResolver, ElementResolver, ContentTypeFileNameResolver, TaxonomyTypeFileNameResolver, TaxonomyTypeResolver, ContentTypeSnippetResolver, ContentTypeSnippetFileNameResolver, ModuleResolution } from '../../models.js';
import { ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
export declare class DeliveryContentTypeGenerator {
    private readonly deliveryNpmPackageName;
    generateModelsAsync(data: {
        outputDir: string;
        typeFolderName: string;
        typeSnippetsFolderName: string;
        taxonomyFolderName: string;
        types: ContentTypeModels.ContentType[];
        taxonomies: TaxonomyModels.Taxonomy[];
        snippets: ContentTypeSnippetModels.ContentTypeSnippet[];
        addTimestamp: boolean;
        addEnvironmentInfo: boolean;
        elementResolver?: ElementResolver;
        contentTypeFileNameResolver?: ContentTypeFileNameResolver;
        contentTypeSnippetFileNameResolver?: ContentTypeSnippetFileNameResolver;
        contentTypeResolver?: ContentTypeResolver;
        contentTypeSnippetResolver?: ContentTypeSnippetResolver;
        taxonomyFileResolver?: TaxonomyTypeFileNameResolver;
        taxonomyResolver?: TaxonomyTypeResolver;
        moduleResolution: ModuleResolution;
    }): Promise<{
        contentTypeFiles: IGeneratedFile[];
        snippetFiles: IGeneratedFile[];
    }>;
    private getContentTypeImports;
    private getModelCode;
    private createContentTypeModel;
    private createContentTypeSnippetModel;
    private getContentTypeComment;
    private getContentTypeSnippetComment;
    private getElementComment;
    private getElementsCode;
    private mapElementType;
    private getExtendedElements;
    private getTaxonomyTypeName;
    private getLinkedItemsAllowedTypes;
    private extractLinkedItemsAllowedTypes;
    private extractUsedSnippet;
    private extractUsedTaxonomy;
}
export declare const deliveryContentTypeGenerator: DeliveryContentTypeGenerator;
