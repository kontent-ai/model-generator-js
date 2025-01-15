import { textHelper } from '../../text-helper.js';
import { nameHelper } from '../../name-helper.js';
import { commonHelper } from '../../common-helper.js';
export function getMapContentTypeToDeliveryTypeName(resolver) {
    return (contentType) => {
        return nameHelper.getDeliveryContentTypeName({
            type: contentType,
            contentTypeResolver: resolver
        });
    };
}
export function getMapContentTypeSnippetToDeliveryTypeName(resolver) {
    return (contentTypeSnippet) => {
        return nameHelper.getDeliveryContentTypeSnippetName({
            snippet: contentTypeSnippet,
            contentTypeResolver: resolver
        });
    };
}
export function getMapContentTypeIdToObject(types) {
    return (id) => {
        const contentType = types.find((m) => m.id === id);
        if (!contentType) {
            throw Error(`Could not find content type with id '${id}'. This may be caused by references to deleted types and can be fixed within Kontent.ai app.`);
        }
        return contentType;
    };
}
export function getMapContentTypeSnippetIdToObject(snippets) {
    return (id) => {
        const snippet = snippets.find((m) => m.id === id);
        if (!snippet) {
            throw Error(`Could not find content type snippet with id '${id}'. This may be caused by references to deleted snippets and can be fixed within Kontent.ai app.`);
        }
        return snippet;
    };
}
export function getMapContentTypeToFileName(resolver) {
    return (contentType, addExtension) => {
        const fileName = nameHelper.getDeliveryContentTypeFilename({
            type: contentType,
            addExtension: addExtension,
            fileResolver: resolver
        });
        return `${fileName}`;
    };
}
export function getMapContentTypeSnippetToFileName(resolver) {
    return (snippet, addExtension) => {
        const fileName = nameHelper.getDeliveryContentTypeSnippetFilename({
            snippet: snippet,
            addExtension: addExtension,
            fileResolver: resolver
        });
        return `${fileName}`;
    };
}
export function getMapElementToName(resolver) {
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
export function getMapTaxonomyName(resolver) {
    return (taxonomy) => {
        return nameHelper.getDeliveryTaxonomyTypeName({
            taxonomy: taxonomy,
            taxonomyResolver: resolver
        });
    };
}
export function getMapTaxonomyToFileName(resolver) {
    return (taxonomy, addExtension) => {
        const fileName = nameHelper.getDeliveryTaxonomyFilename({
            taxonomy: taxonomy,
            addExtension: addExtension,
            fileResolver: resolver
        });
        return `${fileName}`;
    };
}
export function getMapTaxonomyIdTobject(taxonomies) {
    return (id) => {
        const taxonomy = taxonomies.find((m) => m.id === id);
        if (!taxonomy) {
            throw Error(`Could not find taxonomy with id '${id}'`);
        }
        return taxonomy;
    };
}
function getElementName(config) {
    if (!config.elementResolver) {
        return config.elementCodename;
    }
    if (config.elementResolver instanceof Function) {
        return config.elementResolver('', config.elementCodename);
    }
    return textHelper.resolveTextWithDefaultResolver(config.elementCodename, config.elementResolver);
}
//# sourceMappingURL=delivery-mappers.js.map