import { ContentTypeModels, TaxonomyModels } from '@kentico/kontent-management';
import {
    ContentTypeFileNameResolver,
    ContentTypeResolver,
    TaxonomyTypeFileNameResolver,
    TaxonomyTypeResolver
} from './models';
import { textHelper } from './text-helper';

export class NameHelper {
    getDeliveryContentTypeFilename(data: { type: ContentTypeModels.ContentType; fileResolver?: ContentTypeFileNameResolver }): string {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.type)}.ts`;
        }

        let filename: string;

        if (!data.fileResolver) {
            filename = `${data.type.codename}`;
        } else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.type.codename, data.fileResolver)}`;
        }

        return `${filename}.content-type.ts`;
    }

    getDeliveryContentTypeName(data: { type: ContentTypeModels.ContentType; contentTypeResolver?: ContentTypeResolver }): string {
        if (!data.contentTypeResolver) {
            return textHelper.toPascalCase(data.type.name);
        }

        if (data.contentTypeResolver instanceof Function) {
            return `${data.contentTypeResolver(data.type)}`;
        }

        return `${textHelper.resolveTextWithDefaultResolver(data.type.name, data.contentTypeResolver)}`;
    }

    getDeliveryTaxonomyFilename(data: {
        taxonomy: TaxonomyModels.Taxonomy;
        fileResolver?: TaxonomyTypeFileNameResolver;
    }): string {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.taxonomy)}.ts`;
        }

        let filename: string;

        if (!data.fileResolver) {
            filename = `${data.taxonomy.codename}`;
        } else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.taxonomy.codename, data.fileResolver)}`;
        }

        return `${filename}.taxonomy.ts`;
    }

    getDeliveryTaxonomyTypeName(data: { taxonomy: TaxonomyModels.Taxonomy; taxonomyResolver?: TaxonomyTypeResolver }): string {
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
