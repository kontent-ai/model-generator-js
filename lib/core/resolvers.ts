import {} from '@kontent-ai/delivery-sdk';
import {
    ContentTypeModels,
    ContentTypeSnippetModels,
    ContentTypeElements,
    TaxonomyModels
} from '@kontent-ai/management-sdk';
import { commonHelper } from '../common-helper.js';
import {
    ContentTypeResolver,
    ContentTypeSnippetResolver,
    TaxonomyTypeResolver,
    DefaultResolverType,
    ElementResolver
} from '../models.js';
import { toCamelCase, toPascalCase, toSnakeCase } from './core.utils.js';
import { match } from 'ts-pattern';

export type ObjectWithCodename = {
    readonly codename: string;
};

export type ContentTypeFileNameResolver = FilenameResolver<ContentTypeModels.ContentType>;
export type ContentTypeSnippetFileNameResolver = FilenameResolver<ContentTypeSnippetModels.ContentTypeSnippet>;
export type TaxonomyTypeFileNameResolver = FilenameResolver<TaxonomyModels.Taxonomy>;

export type FilenameResolver<T extends object> =
    | undefined
    | DefaultResolverType
    | ((item: T & ObjectWithCodename) => string);

export type MapContentTypeToDeliveryTypeName = (contentType: Readonly<ContentTypeModels.ContentType>) => string;
export type MapContentTypeSnippetToDeliveryTypeName = (
    contentTypeSnippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>
) => string;
export type MapContentTypeToFileName = (
    contentType: Readonly<ContentTypeModels.ContentType>,
    addExtension: boolean
) => string;
export type MapContentTypeSnippetToFileName = (
    contentTypeSnippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>,
    addExtension: boolean
) => string;

export type MapObjectToFileName<T extends Readonly<ObjectWithCodename> = ObjectWithCodename> = (
    item: T,
    addExtension: boolean
) => string;

export type MapElementToName = (element: Readonly<ContentTypeElements.ContentTypeElementModel>) => string | undefined;
export type MapTaxonomyName = (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
export type MapTaxonomyToFileName = (taxonomy: Readonly<TaxonomyModels.Taxonomy>, addExtension: boolean) => string;

export function getMapContentTypeToDeliveryTypeName(resolver?: ContentTypeResolver): MapContentTypeToDeliveryTypeName {
    return (contentType) => {
        return getDeliveryContentTypeName({
            type: contentType,
            contentTypeResolver: resolver
        });
    };
}

export function getMapContentTypeSnippetToDeliveryTypeName(
    resolver?: ContentTypeSnippetResolver
): MapContentTypeSnippetToDeliveryTypeName {
    return (contentTypeSnippet) => {
        return getDeliveryContentTypeSnippetName({
            snippet: contentTypeSnippet,
            contentTypeResolver: resolver
        });
    };
}

export function getMapContentTypeToFileName(resolver?: ContentTypeFileNameResolver): MapContentTypeToFileName {
    return (contentType, addExtension) => {
        return match(resolver)
            .returnType<string>()
            .when(
                (resolver) => resolver instanceof Function,
                (resolver) => `${resolver(contentType)}${addExtension ? '.ts' : ''}`
            )
            .when(
                (resolver) => resolver === undefined,
                () => `${contentType.codename}`
            )
            .otherwise((resolverType) => `${resolveTextWithDefaultResolver(contentType.codename, resolverType)}`);
    };
}

export function getMapContentTypeSnippetToFileName(
    resolver?: ContentTypeSnippetFileNameResolver
): MapContentTypeSnippetToFileName {
    return (snippet, addExtension) => {
        return addExtensionToFilename(
            match(resolver)
                .returnType<string>()
                .when(
                    (resolver) => resolver instanceof Function,
                    (resolver) => resolver(snippet)
                )
                .when(
                    (resolver) => resolver === undefined,
                    () => snippet.codename
                )
                .otherwise((resolverType) => `${resolveTextWithDefaultResolver(snippet.codename, resolverType)}`),

            addExtension
        );
    };
}

export function mapFilename<T extends ObjectWithCodename>(resolver: FilenameResolver<T>): MapObjectToFileName<T> {
    return (item, addExtension) => {
        return addExtensionToFilename(
            match(resolver)
                .returnType<string>()
                .when(
                    (resolver) => resolver instanceof Function,
                    (resolver) => resolver(item)
                )
                .when(
                    (resolver) => resolver === undefined,
                    () => item.codename
                )
                .otherwise((resolverType) => `${resolveTextWithDefaultResolver(item.codename, resolverType)}`),

            addExtension
        );
    };
}

function addExtensionToFilename(filename: string, addExtension: boolean): string {
    return `${filename}${addExtension ? '.ts' : ''}`;
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
        return getDeliveryTaxonomyTypeName({
            taxonomy: taxonomy,
            taxonomyResolver: resolver
        });
    };
}

export function getMapTaxonomyToFileName(resolver?: TaxonomyTypeFileNameResolver): MapTaxonomyToFileName {
    return (taxonomy, addExtension) => {
        const fileName = getDeliveryTaxonomyFilename({
            taxonomy: taxonomy,
            addExtension: addExtension,
            fileResolver: resolver
        });
        return `${fileName}`;
    };
}

function getDeliveryContentTypeName(data: {
    readonly type: Readonly<ContentTypeModels.ContentType>;
    readonly contentTypeResolver?: ContentTypeResolver;
}): string {
    if (!data.contentTypeResolver) {
        return toPascalCase(data.type.name);
    }

    if (data.contentTypeResolver instanceof Function) {
        return `${data.contentTypeResolver(data.type)}`;
    }

    return `${resolveTextWithDefaultResolver(data.type.name, data.contentTypeResolver)}`;
}

function getDeliveryContentTypeSnippetName(data: {
    readonly snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>;
    readonly contentTypeResolver?: ContentTypeResolver;
}): string {
    if (!data.contentTypeResolver) {
        return toPascalCase(data.snippet.name);
    }

    if (data.contentTypeResolver instanceof Function) {
        return `${data.contentTypeResolver(data.snippet)}`;
    }

    return `${resolveTextWithDefaultResolver(data.snippet.name, data.contentTypeResolver)}`;
}

function getDeliveryTaxonomyFilename(data: {
    readonly taxonomy: Readonly<TaxonomyModels.Taxonomy>;
    readonly fileResolver?: TaxonomyTypeFileNameResolver;
    readonly addExtension: boolean;
}): string {
    if (data.fileResolver instanceof Function) {
        return `${data.fileResolver(data.taxonomy)}${data.addExtension ? '.ts' : ''}`;
    }

    let filename: string;

    if (!data.fileResolver) {
        filename = `${data.taxonomy.codename}`;
    } else {
        filename = `${resolveTextWithDefaultResolver(data.taxonomy.codename, data.fileResolver)}`;
    }

    return `${filename}${data.addExtension ? '.ts' : ''}`;
}

function getDeliveryTaxonomyTypeName(data: {
    readonly taxonomy: Readonly<TaxonomyModels.Taxonomy>;
    readonly taxonomyResolver?: TaxonomyTypeResolver;
}): string {
    if (!data.taxonomyResolver) {
        return toPascalCase(data.taxonomy.name);
    }

    if (data.taxonomyResolver instanceof Function) {
        return `${data.taxonomyResolver(data.taxonomy)}`;
    }

    return `${resolveTextWithDefaultResolver(data.taxonomy.name, data.taxonomyResolver)}`;
}

function getElementName(config: { elementCodename: string; elementResolver?: ElementResolver }): string {
    if (!config.elementResolver) {
        return config.elementCodename;
    }

    if (config.elementResolver instanceof Function) {
        return config.elementResolver('', config.elementCodename);
    }

    return resolveTextWithDefaultResolver(config.elementCodename, config.elementResolver);
}

function resolveTextWithDefaultResolver(text: string, resolverType: DefaultResolverType): string {
    switch (resolverType) {
        case 'camelCase':
            return toCamelCase(text);
        case 'pascalCase':
            return toPascalCase(text);
        case 'snakeCase':
            return toSnakeCase(text);
        default:
            throw Error(`Invalid name resolver. Available options are: camelCase, pascalCase, snakeCase`);
    }
}
