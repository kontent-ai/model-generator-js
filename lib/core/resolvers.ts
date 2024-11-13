import { ContentTypeElements, ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { match, P } from 'ts-pattern';
import { CaseType, ObjectWithCodename, ObjectWithName } from './core.models.js';
import { toCamelCase, toPascalCase } from './core.utils.js';

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
        prefix?: string;
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

function addExtensionToFilename(filename: string, addExtension: boolean): string {
    return `${filename}${addExtension ? '.ts' : ''}`;
}

function resolveCase(text: string, resolverType: CaseType): string {
    return match(resolverType)
        .returnType<string>()
        .with('camelCase', () => toCamelCase(text))
        .with('pascalCase', () => toPascalCase(text))
        .exhaustive();
}
