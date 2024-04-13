import {
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    TaxonomyModels
} from '@kontent-ai/management-sdk';
import { textHelper } from '../../text-helper.js';
import {
    ContentTypeFileNameResolver,
    ContentTypeResolver,
    ContentTypeSnippetFileNameResolver,
    ContentTypeSnippetResolver,
    ElementResolver,
    TaxonomyTypeFileNameResolver,
    TaxonomyTypeResolver
} from '../../models.js';
import { nameHelper } from '../../name-helper.js';
import { commonHelper } from '../../common-helper.js';

export type MapContentTypeToDeliveryTypeName = (contentType: ContentTypeModels.ContentType) => string;
export type MapContentTypeSnippetToDeliveryTypeName = (
    contentTypeSnippet: ContentTypeSnippetModels.ContentTypeSnippet
) => string;
export type MapContentTypeIdToObject = (id: string) => ContentTypeModels.ContentType;
export type MapContentTypeSnippetIdToObject = (id: string) => ContentTypeSnippetModels.ContentTypeSnippet;
export type MapContentTypeToFileName = (contentType: ContentTypeModels.ContentType, addExtension: boolean) => string;
export type MapContentTypeSnippetToFileName = (
    contentTypeSnippet: ContentTypeSnippetModels.ContentTypeSnippet,
    addExtension: boolean
) => string;
export type MapElementToName = (element: ContentTypeElements.ContentTypeElementModel) => string | undefined;

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

export function getMapContentTypeSnippetToDeliveryTypeName(
    resolver?: ContentTypeSnippetResolver
): MapContentTypeSnippetToDeliveryTypeName {
    return (contentTypeSnippet) => {
        return nameHelper.getDeliveryContentTypeSnippetName({
            snippet: contentTypeSnippet,
            contentTypeResolver: resolver
        });
    };
}

export function getMapContentTypeIdToObject(types: ContentTypeModels.ContentType[]): MapContentTypeIdToObject {
    return (id) => {
        const contentType = types.find((m) => m.id === id);

        if (!contentType) {
            throw Error(
                `Could not find content type with id '${id}'. This may be caused by references to deleted types and can be fixed within Kontent.ai app.`
            );
        }

        return contentType;
    };
}

export function getMapContentTypeSnippetIdToObject(
    snippets: ContentTypeSnippetModels.ContentTypeSnippet[]
): MapContentTypeSnippetIdToObject {
    return (id) => {
        const snippet = snippets.find((m) => m.id === id);

        if (!snippet) {
            throw Error(
                `Could not find content type snippet with id '${id}'. This may be caused by references to deleted snippets and can be fixed within Kontent.ai app.`
            );
        }

        return snippet;
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

export function getMapContentTypeSnippetToFileName(
    resolver?: ContentTypeSnippetFileNameResolver
): MapContentTypeSnippetToFileName {
    return (snippet, addExtension) => {
        const fileName = nameHelper.getDeliveryContentTypeSnippetFilename({
            snippet: snippet,
            addExtension: addExtension,
            fileResolver: resolver
        });
        return `${fileName}`;
    };
}

export function getMapElementToName(resolver?: ElementResolver): MapElementToName {
    return (element) => {
        if (!element) {
            return undefined;
        }

        const codename = commonHelper.getElementCodename(element);

        if (!codename) {
            return undefined;
        }
        const elementName = getElementName({
            elementCodename: codename,
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

function getElementName(config: { elementCodename: string; elementResolver?: ElementResolver }): string {
    if (!config.elementResolver) {
        return config.elementCodename;
    }

    if (config.elementResolver instanceof Function) {
        return config.elementResolver('', config.elementCodename);
    }

    return textHelper.resolveTextWithDefaultResolver(config.elementCodename, config.elementResolver);
}
