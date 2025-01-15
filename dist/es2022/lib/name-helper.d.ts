import { ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { ContentTypeFileNameResolver, ContentTypeResolver, TaxonomyTypeFileNameResolver, TaxonomyTypeResolver } from './models.js';
export declare class NameHelper {
    getDeliveryContentTypeFilename(data: {
        type: ContentTypeModels.ContentType;
        addExtension: boolean;
        fileResolver?: ContentTypeFileNameResolver;
    }): string;
    getDeliveryContentTypeSnippetFilename(data: {
        snippet: ContentTypeSnippetModels.ContentTypeSnippet;
        addExtension: boolean;
        fileResolver?: ContentTypeFileNameResolver;
    }): string;
    getDeliveryContentTypeName(data: {
        type: ContentTypeModels.ContentType;
        contentTypeResolver?: ContentTypeResolver;
    }): string;
    getDeliveryContentTypeSnippetName(data: {
        snippet: ContentTypeSnippetModels.ContentTypeSnippet;
        contentTypeResolver?: ContentTypeResolver;
    }): string;
    getDeliveryTaxonomyFilename(data: {
        taxonomy: TaxonomyModels.Taxonomy;
        fileResolver?: TaxonomyTypeFileNameResolver;
        addExtension: boolean;
    }): string;
    getDeliveryTaxonomyTypeName(data: {
        taxonomy: TaxonomyModels.Taxonomy;
        taxonomyResolver?: TaxonomyTypeResolver;
    }): string;
}
export declare const nameHelper: NameHelper;
