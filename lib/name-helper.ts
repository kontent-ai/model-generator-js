import { ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import {
    ContentTypeFileNameResolver,
    ContentTypeResolver,
    TaxonomyTypeFileNameResolver,
    TaxonomyTypeResolver
} from './models';
import { textHelper } from './text-helper';

export class NameHelper {
    getDeliveryContentTypeFilename(data: {
        type: ContentTypeModels.ContentType;
        addExtension: boolean;
        fileResolver?: ContentTypeFileNameResolver;
    }): string {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.type)}${data.addExtension ? '.ts' : ''}`;
        }

        let filename: string;

        if (!data.fileResolver) {
            filename = `${data.type.codename}`;
        } else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.type.codename, data.fileResolver)}`;
        }

        return `${filename}${data.addExtension ? '.ts' : ''}`;
    }

    getDeliveryContentTypeSnippetFilename(data: {
        snippet: ContentTypeSnippetModels.ContentTypeSnippet;
        addExtension: boolean;
        fileResolver?: ContentTypeFileNameResolver;
    }): string {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.snippet)}${data.addExtension ? '.ts' : ''}`;
        }

        let filename: string;

        if (!data.fileResolver) {
            filename = `${data.snippet.codename}`;
        } else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.snippet.codename, data.fileResolver)}`;
        }

        return `${filename}${data.addExtension ? '.ts' : ''}`;
    }

    getDeliveryContentTypeName(data: {
        type: ContentTypeModels.ContentType;
        contentTypeResolver?: ContentTypeResolver;
    }): string {
        if (!data.contentTypeResolver) {
            return textHelper.toPascalCase(data.type.name);
        }

        if (data.contentTypeResolver instanceof Function) {
            return `${data.contentTypeResolver(data.type)}`;
        }

        return `${textHelper.resolveTextWithDefaultResolver(data.type.name, data.contentTypeResolver)}`;
    }

    getDeliveryContentTypeSnippetName(data: {
        snippet: ContentTypeSnippetModels.ContentTypeSnippet;
        contentTypeResolver?: ContentTypeResolver;
    }): string {
        if (!data.contentTypeResolver) {
            return textHelper.toPascalCase(data.snippet.name);
        }

        if (data.contentTypeResolver instanceof Function) {
            return `${data.contentTypeResolver(data.snippet)}`;
        }

        return `${textHelper.resolveTextWithDefaultResolver(data.snippet.name, data.contentTypeResolver)}`;
    }

    getDeliveryTaxonomyFilename(data: {
        taxonomy: TaxonomyModels.Taxonomy;
        fileResolver?: TaxonomyTypeFileNameResolver;
        addExtension: boolean;
    }): string {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.taxonomy)}${data.addExtension ? '.ts' : ''}`;
        }

        let filename: string;

        if (!data.fileResolver) {
            filename = `${data.taxonomy.codename}`;
        } else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.taxonomy.codename, data.fileResolver)}`;
        }

        return `${filename}${data.addExtension ? '.ts' : ''}`;
    }

    getDeliveryTaxonomyTypeName(data: {
        taxonomy: TaxonomyModels.Taxonomy;
        taxonomyResolver?: TaxonomyTypeResolver;
    }): string {
        if (!data.taxonomyResolver) {
            return textHelper.toPascalCase(data.taxonomy.name);
        }

        if (data.taxonomyResolver instanceof Function) {
            return `${data.taxonomyResolver(data.taxonomy)}`;
        }

        return `${textHelper.resolveTextWithDefaultResolver(data.taxonomy.name, data.taxonomyResolver)}`;
    }
}

export const nameHelper = new NameHelper();
