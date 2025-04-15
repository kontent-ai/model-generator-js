import type {
    CollectionModels,
    ContentTypeElements,
    ContentTypeModels,
    ContentTypeSnippetModels,
    LanguageModels,
    TaxonomyModels,
    WorkflowModels
} from '@kontent-ai/management-sdk';
import { createHash } from 'crypto';
import { match, P } from 'ts-pattern';
import type { CaseType, ObjectWithCodename, ObjectWithName } from './core.models.js';

/** File name resolvers */
export type FilenameResolver<T extends Readonly<object>> = undefined | CaseType | ((item: T & ObjectWithCodename) => string);
export type MapObjectToFileName<T extends Readonly<ObjectWithCodename> = ObjectWithCodename> = (item: T, addExtension: boolean) => string;

export type ContentTypeFileNameResolver = FilenameResolver<Readonly<ContentTypeModels.ContentType>>;
export type ContentTypeSnippetFileNameResolver = FilenameResolver<Readonly<ContentTypeSnippetModels.ContentTypeSnippet>>;
export type TaxonomyTypeFileNameResolver = FilenameResolver<Readonly<TaxonomyModels.Taxonomy>>;
export type LanguageTypeFileNameResolver = FilenameResolver<Readonly<LanguageModels.LanguageModel>>;
export type CollectionTypeFileNameResolver = FilenameResolver<Readonly<CollectionModels.Collection>>;
export type WorkflowTypeFileNameResolver = FilenameResolver<Readonly<WorkflowModels.Workflow>>;
/** Name resolvers */
export type NameResolver<T extends Readonly<object>> = undefined | CaseType | ((item: T & ObjectWithName) => string);
export type MapObjectToName<T extends Readonly<ObjectWithName> = ObjectWithName> = (item: T) => string;

export type ElementNameResolver = (element: Readonly<Readonly<ContentTypeElements.ContentTypeElementModel>>) => string | undefined;
export type ContentTypeNameResolver = NameResolver<Readonly<ContentTypeModels.ContentType>>;
export type ContentTypeSnippetNameResolver = NameResolver<Readonly<ContentTypeSnippetModels.ContentTypeSnippet>>;
export type TaxonomyNameResolver = NameResolver<Readonly<TaxonomyModels.Taxonomy>>;
export type LanguageNameResolver = NameResolver<Readonly<LanguageModels.LanguageModel>>;
export type CollectionNameResolver = NameResolver<Readonly<CollectionModels.Collection>>;
export type WorkflowNameResolver = NameResolver<Readonly<WorkflowModels.Workflow>>;

export function mapFilename<T extends ObjectWithCodename>(
    resolver: FilenameResolver<T>,
    options?: {
        readonly prefix?: string;
        readonly suffix?: string;
    }
): MapObjectToFileName<T> {
    return (item, addExtension) => {
        return (
            (options?.prefix ? options.prefix : '') +
            addExtensionToFilename(
                match(resolver)
                    .returnType<string>()
                    .with(P.instanceOf(Function), (resolver) => resolver(item))
                    .with(undefined, () => resolveCase(item.codename, 'camelCase'))
                    .otherwise((resolverType) => resolveCase(item.codename, resolverType)),
                addExtension
            ) +
            (options?.suffix ? options.suffix : '')
        );
    };
}

export function mapName<T extends ObjectWithName>(
    resolver: NameResolver<T>,
    defaultCase: CaseType,
    options?: {
        readonly prefix?: string;
        readonly suffix?: string;
    }
): MapObjectToName<T> {
    return (item) =>
        (options?.prefix ? options.prefix : '') +
        match(resolver)
            .returnType<string>()
            .with(P.instanceOf(Function), (resolver) => resolver(item))
            .with(undefined, () => resolveCase(item.name, defaultCase))
            .otherwise((resolverType) => resolveCase(item.name, resolverType)) +
        (options?.suffix ? options.suffix : '');
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
