import { ContentTypeElements, ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { FlattenedElement } from './core.models.js';
import { isNotUndefined } from '@kontent-ai/migration-toolkit';
import { match } from 'ts-pattern';

interface ElementWrapper {
    readonly element: Readonly<ContentTypeElements.ContentTypeElementModel>;
    readonly fromSnippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet> | undefined;
}

export function getFlattenedElements(
    elements: readonly Readonly<ContentTypeElements.ContentTypeElementModel>[],
    snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[],
    taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[],
    types: readonly Readonly<ContentTypeModels.ContentType>[]
): readonly FlattenedElement[] {
    return elements
        .filter((element) => {
            return element.type !== 'guidelines';
        })
        .flatMap<ElementWrapper>((element) => {
            if (element.type === 'snippet') {
                const snippet = snippets.find((snippet) => snippet.id === element.snippet.id);

                if (!snippet) {
                    throw Error(`Could not find snippet with id '${element.snippet.id}'`);
                }

                return snippet.elements.map((snippetElement) => {
                    return {
                        element: snippetElement,
                        fromSnippet: snippet
                    };
                });
            }

            return {
                element: element,
                fromSnippet: undefined
            };
        })
        .map((element) => {
            return getFlattenedElement(element, taxonomies, types);
        })
        .filter(isNotUndefined);
}

export function getFlattenedElement(
    wrapper: ElementWrapper,
    taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[],
    types: readonly Readonly<ContentTypeModels.ContentType>[]
): Readonly<FlattenedElement> | undefined {
    if (!wrapper.element.codename || !wrapper.element.id) {
        return undefined;
    }

    return {
        title: getElementTitle(wrapper.element, taxonomies),
        codename: wrapper.element.codename,
        id: wrapper.element.id,
        type: wrapper.element.type,
        isRequired: isElementRequired(wrapper.element),
        guidelines: getElementGuidelines(wrapper.element),
        externalId: wrapper.element.external_id,
        originalElement: wrapper.element,
        allowedContentTypes: extractLinkedItemsAllowedTypes(wrapper.element, types),
        assignedTaxonomy: extractTaxonomy(wrapper.element, taxonomies),
        fromSnippet: wrapper.fromSnippet
    };
}

function isElementRequired(element: Readonly<ContentTypeElements.ContentTypeElementModel>): boolean {
    return (<{ is_required?: boolean }>element)['is_required'] === true;
}

function getElementGuidelines(element: Readonly<ContentTypeElements.ContentTypeElementModel>): string | undefined {
    return (<{ guidelines?: string }>element)['guidelines'];
}

function getElementTitle(
    element: Readonly<ContentTypeElements.ContentTypeElementModel>,
    taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]
): string {
    if (element.type === 'taxonomy') {
        const taxonomyGroupId = element.taxonomy_group?.id;

        if (!taxonomyGroupId) {
            return element.type;
        }

        const taxonomy = taxonomies.find((m) => m.id === taxonomyGroupId);
        return taxonomy?.name ?? element.type;
    }
    return (<{ name?: string }>element).name ?? element.codename ?? 'n/a';
}

function extractLinkedItemsAllowedTypes(
    element: Readonly<ContentTypeElements.ContentTypeElementModel>,
    types: readonly Readonly<ContentTypeModels.ContentType>[]
): readonly Readonly<ContentTypeModels.ContentType>[] {
    const allowedTypeIds = match(element)
        .returnType<Readonly<string>[]>()
        .with({ type: 'modular_content' }, (linkedItemsElement) => {
            return linkedItemsElement.allowed_content_types?.map((m) => m.id).filter(isNotUndefined) ?? [];
        })
        .with({ type: 'subpages' }, (linkedItemsElement) => {
            return linkedItemsElement.allowed_content_types?.map((m) => m.id).filter(isNotUndefined) ?? [];
        })
        .otherwise(() => []);

    return allowedTypeIds.map((id) => types.find((m) => m.id === id)).filter(isNotUndefined);
}

function extractTaxonomy(
    element: Readonly<ContentTypeElements.ContentTypeElementModel>,
    taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]
): Readonly<TaxonomyModels.Taxonomy> | undefined {
    return match(element)
        .returnType<Readonly<TaxonomyModels.Taxonomy> | undefined>()
        .with({ type: 'taxonomy' }, (taxonomyElement) => {
            return taxonomies.find((m) => m.id === taxonomyElement.taxonomy_group?.id);
        })
        .otherwise(() => undefined);
}
