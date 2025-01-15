import { textHelper } from './text-helper.js';
export class NameHelper {
    getDeliveryContentTypeFilename(data) {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.type)}${data.addExtension ? '.ts' : ''}`;
        }
        let filename;
        if (!data.fileResolver) {
            filename = `${data.type.codename}`;
        }
        else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.type.codename, data.fileResolver)}`;
        }
        return `${filename}${data.addExtension ? '.ts' : ''}`;
    }
    getDeliveryContentTypeSnippetFilename(data) {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.snippet)}${data.addExtension ? '.ts' : ''}`;
        }
        let filename;
        if (!data.fileResolver) {
            filename = `${data.snippet.codename}`;
        }
        else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.snippet.codename, data.fileResolver)}`;
        }
        return `${filename}${data.addExtension ? '.ts' : ''}`;
    }
    getDeliveryContentTypeName(data) {
        if (!data.contentTypeResolver) {
            return textHelper.toPascalCase(data.type.name);
        }
        if (data.contentTypeResolver instanceof Function) {
            return `${data.contentTypeResolver(data.type)}`;
        }
        return `${textHelper.resolveTextWithDefaultResolver(data.type.name, data.contentTypeResolver)}`;
    }
    getDeliveryContentTypeSnippetName(data) {
        if (!data.contentTypeResolver) {
            return textHelper.toPascalCase(data.snippet.name);
        }
        if (data.contentTypeResolver instanceof Function) {
            return `${data.contentTypeResolver(data.snippet)}`;
        }
        return `${textHelper.resolveTextWithDefaultResolver(data.snippet.name, data.contentTypeResolver)}`;
    }
    getDeliveryTaxonomyFilename(data) {
        if (data.fileResolver instanceof Function) {
            return `${data.fileResolver(data.taxonomy)}${data.addExtension ? '.ts' : ''}`;
        }
        let filename;
        if (!data.fileResolver) {
            filename = `${data.taxonomy.codename}`;
        }
        else {
            filename = `${textHelper.resolveTextWithDefaultResolver(data.taxonomy.codename, data.fileResolver)}`;
        }
        return `${filename}${data.addExtension ? '.ts' : ''}`;
    }
    getDeliveryTaxonomyTypeName(data) {
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
//# sourceMappingURL=name-helper.js.map