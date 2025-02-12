import type { ContentTypeElements, ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { createHash } from 'crypto';
import { match, P } from 'ts-pattern';
import type { CaseType, ObjectWithCodename, ObjectWithName } from './core.models.js';

/** File name resolvers */
export type FilenameResolver<T extends Readonly<object>> = undefined | CaseType | ((item: T & ObjectWithCodename) => string);
export type MapObjectToFileName<T extends Readonly<ObjectWithCodename> = ObjectWithCodename> = (item: T, addExtension: boolean) => string;

export type ContentTypeFileNameResolver = FilenameResolver<ContentTypeModels.ContentType>;
export type ContentTypeSnippetFileNameResolver = FilenameResolver<ContentTypeSnippetModels.ContentTypeSnippet>;
export type TaxonomyTypeFileNameResolver = FilenameResolver<TaxonomyModels.Taxonomy>;

/** Name resolvers */
export type NameResolver<T extends Readonly<object>> = undefined | CaseType | ((item: T & ObjectWithName) => string);
export type MapObjectToName<T extends Readonly<ObjectWithName> = ObjectWithName> = (item: T) => string;

export type ElementNameResolver = (element: Readonly<ContentTypeElements.ContentTypeElementModel>) => string | undefined;
export type ContentTypeNameResolver = NameResolver<ContentTypeModels.ContentType>;
export type ContentTypeSnippetNameResolver = NameResolver<ContentTypeSnippetModels.ContentTypeSnippet>;
export type TaxonomyNameResolver = NameResolver<TaxonomyModels.Taxonomy>;

export function mapFilename<T extends ObjectWithCodename>(resolver: FilenameResolver<T>): MapObjectToFileName<T> {
    return (item, addExtension) => {
        return addExtensionToFilename(
            match(resolver)
                .returnType<string>()
                .with(P.instanceOf(Function), (resolver) => resolver(item))
                .with(undefined, () => item.codename)
                .otherwise((resolverType) => resolveCase(item.codename, resolverType)),
            addExtension
        );
    };
}

export function mapName<T extends ObjectWithName>(
    resolver: NameResolver<T>,
    defaultCase: CaseType,
    options?: {
        readonly prefix?: string;
    }
): MapObjectToName<T> {
    return (item) =>
        (options?.prefix ? options.prefix : '') +
        match(resolver)
            .returnType<string>()
            .with(P.instanceOf(Function), (resolver) => resolver(item))
            .with(undefined, () => resolveCase(item.name, defaultCase))
            .otherwise((resolverType) => resolveCase(item.name, resolverType));
}

export function resolveCase(text: string, resolverType: CaseType): string {
    return match(resolverType)
        .returnType<string>()
        .with('camelCase', () => toCamelCase(text))
        .with('pascalCase', () => toPascalCase(text))
        .exhaustive();
}

export function resolvePropertyName(value: string): string {
    const propertyName = toCamelCase(value);

    if (propertyName.length === 0) {
        // to prevent empty string being used as property name, use hash
        return getPropertyStringHash(value);
    }

    return prefixWithUnderscoreWhenStartsWithNonAlpha(propertyName);
}

function addExtensionToFilename(filename: string, addExtension: boolean): string {
    return `${filename}${addExtension ? '.ts' : ''}`;
}

function toPascalCase(text: string): string {
    return prefixWithUnderscoreWhenStartsWithNonAlpha(
        toSafeStringCode(
            text
                .replace(/[_-]+/g, ' ')
                .replace(/(?:^\w|[A-Z]|\b\w|\s+|\d\w)/g, (match, index) => (index === 0 ? match.toUpperCase() : match.toUpperCase()))
                .replace(/\s+/g, '')
        )
    );
}

function toCamelCase(text: string): string {
    return toPascalCase(text).replace(/^\w/, (s) => s.toLowerCase());
}

function getPropertyStringHash(text: string): string {
    const hash = createHash('sha256');
    hash.update(text);
    return `_${hash.digest('hex')}`.slice(0, 10);
}

function toSafeStringCode(text: string): string {
    const replaceWith = '';
    return text.replace(/[\s-]/g, replaceWith).replace(/[^a-zA-Z0-9_]/g, replaceWith);
}

function prefixWithUnderscoreWhenStartsWithNonAlpha(text: string): string {
    if (/^[^a-zA-Z]/.test(text)) {
        return `_${text.replace(/^_+/, '')}`;
    }
    return text;
}
