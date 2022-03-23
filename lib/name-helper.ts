import { IContentType, ITaxonomyGroup } from '@kentico/kontent-delivery';
import {
    ContentTypeFileNameResolver,
    ContentTypeResolver,
    TaxonomyTypeFileNameResolver,
    TaxonomyTypeResolver
} from './models';
import { textHelper } from './text-helper';

export class NameHelper {
    getDeliveryContentTypeFilename(data: { type: IContentType; fileResolver?: ContentTypeFileNameResolver }): string {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.type)}.ts`;
        }

        let filename: string;

        if (!data.fileResolver) {
            filename = `${data.type.system.codename}`;
        } else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.type.system.codename, data.fileResolver)}`;
        }

        return `${filename}.content-type.ts`;
    }

    getDeliveryContentTypeName(data: { type: IContentType; contentTypeResolver?: ContentTypeResolver }): string {
        if (!data.contentTypeResolver) {
            return textHelper.toPascalCase(data.type.system.name);
        }

        if (data.contentTypeResolver instanceof Function) {
            return `${data.contentTypeResolver(data.type)}`;
        }

        return `${textHelper.resolveTextWithDefaultResolver(data.type.system.name, data.contentTypeResolver)}`;
    }

    getDeliveryTaxonomyFilename(data: {
        taxonomy: ITaxonomyGroup;
        fileResolver?: TaxonomyTypeFileNameResolver;
    }): string {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.taxonomy)}.ts`;
        }

        let filename: string;

        if (!data.fileResolver) {
            filename = `${data.taxonomy.system.codename}`;
        } else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.taxonomy.system.codename, data.fileResolver)}`;
        }

        return `${filename}.taxonomy.ts`;
    }

    getDeliveryTaxonomyTypeName(data: { taxonomy: ITaxonomyGroup; taxonomyResolver?: TaxonomyTypeResolver }): string {
        if (!data.taxonomyResolver) {
            return textHelper.toPascalCase(data.taxonomy.system.name);
        }

        if (data.taxonomyResolver instanceof Function) {
            return `${data.taxonomyResolver(data.taxonomy)}`;
        }

        return `${textHelper.resolveTextWithDefaultResolver(data.taxonomy.system.name, data.taxonomyResolver)}`;
    }
}

export const nameHelper = new NameHelper();
