import { ContentTypeElements, ContentTypeModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { textHelper } from '../../text-helper';
import {
    ContentTypeFileNameResolver,
    ContentTypeResolver,
    ElementResolver,
    TaxonomyTypeFileNameResolver,
    TaxonomyTypeResolver
} from '../../models';
import { nameHelper } from '../../name-helper';

export type MapContentTypeToDeliveryTypeName = (contentType: ContentTypeModels.ContentType) => string;
export type MapContentTypeIdToObject = (id: string) => ContentTypeModels.ContentType;
export type MapContentTypeToFileName = (contentType: ContentTypeModels.ContentType, addExtension: boolean) => string;
export type MapElementToName = (
    element: ContentTypeElements.ContentTypeElementModel,
    contentType: ContentTypeModels.ContentType
) => string | undefined;

export type MapTaxonomyName = (taxonomy: TaxonomyModels.Taxonomy) => string;
export type MapTaxonomyIdTobject = (id: string) => TaxonomyModels.Taxonomy;
export type MapTaxonomyToFileName = (taxonomy: TaxonomyModels.Taxonomy, addExtension: boolean) => string;

export function getMapContentTypeToDeliveryTypeName(resolver?: ContentTypeResolver): MapContentTypeToDeliveryTypeName {
    return (contentType) => {
        return nameHelper.getDeliveryContentTypeName({
            type: contentType,
            contentTypeResolver: resolver
        });
    };
}

export function getMapContentTypeIdToObject(types: ContentTypeModels.ContentType[]): MapContentTypeIdToObject {
    return (id) => {
        const contentType = types.find((m) => m.id === id);

        if (!contentType) {
            throw Error(`Could not find content type with id '${id}'`);
        }

        return contentType;
    };
}

export function getMapContentTypeToFileName(resolver?: ContentTypeFileNameResolver): MapContentTypeToFileName {
    return (contentType, addExtension) => {
        const fileName = nameHelper.getDeliveryContentTypeFilename({
            type: contentType,
            addExtension: addExtension,
            fileResolver: resolver
        });
        return `${fileName}`;
    };
}

export function getMapElementToName(resolver?: ElementResolver): MapElementToName {
    return (element, contentType) => {
        if (!element.codename) {
            return undefined;
        }
        const elementName = getElementName({
            elementCodename: element.codename,
            type: contentType.codename,
            elementResolver: resolver
        });

        return elementName;
    };
}

export function getMapTaxonomyName(resolver?: TaxonomyTypeResolver): MapTaxonomyName {
    return (taxonomy) => {
        return nameHelper.getDeliveryTaxonomyTypeName({
            taxonomy: taxonomy,
            taxonomyResolver: resolver
        });
    };
}

export function getMapTaxonomyToFileName(resolver?: TaxonomyTypeFileNameResolver): MapTaxonomyToFileName {
    return (taxonomy, addExtension) => {
        const fileName = nameHelper.getDeliveryTaxonomyFilename({
            taxonomy: taxonomy,
            addExtension: addExtension,
            fileResolver: resolver
        });
        return `${fileName}`;
    };
}

export function getMapTaxonomyIdTobject(taxonomies: TaxonomyModels.Taxonomy[]): MapTaxonomyIdTobject {
    return (id) => {
        const taxonomy = taxonomies.find((m) => m.id === id);

        if (!taxonomy) {
            throw Error(`Could not find taxonomy with id '${id}'`);
        }

        return taxonomy;
    };
}

function getElementName(config: { type: string; elementCodename: string; elementResolver?: ElementResolver }): string {
    if (!config.elementResolver) {
        return config.elementCodename;
    }

    if (config.elementResolver instanceof Function) {
        return config.elementResolver(config.type, config.elementCodename);
    }

    return textHelper.resolveTextWithDefaultResolver(config.elementCodename, config.elementResolver);
}
