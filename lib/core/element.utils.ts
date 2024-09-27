import { ContentTypeElements, ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { match, P } from 'ts-pattern';
import { FlattenedElement, MultipleChoiceOption } from './core.models.js';
import { isNotUndefined } from './core.utils.js';

interface ElementWrapper {
    readonly element: Readonly<ContentTypeElements.ContentTypeElementModel>;
    readonly fromSnippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet> | undefined;
}

export function getFlattenedElements(data: {
    readonly elements: readonly Readonly<ContentTypeElements.ContentTypeElementModel>[];
    readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[];
    readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
    readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
}): readonly FlattenedElement[] {
    return data.elements
        .flatMap<ElementWrapper>((element) => {
            if (element.type === 'snippet') {
                const snippet = data.snippets.find((snippet) => snippet.id === element.snippet.id);

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
            return getFlattenedElement(element, data.taxonomies, data.types);
        })
        .filter(isNotUndefined)
        .filter((element) => {
            return element.type !== 'guidelines';
        });
}

function getFlattenedElement(
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
        fromSnippet: wrapper.fromSnippet,
        multipleChoiceOptions: extractMultipleChoiceOptions(wrapper.element)
    };
}

function isElementRequired(element: Readonly<ContentTypeElements.ContentTypeElementModel>): boolean {
    return match(element)
        .returnType<boolean>()
        .with({ is_required: true }, () => true)
        .otherwise(() => false);
}

function getElementGuidelines(element: Readonly<ContentTypeElements.ContentTypeElementModel>): string | undefined {
    return match(element)
        .returnType<string | undefined>()
        .with({ guidelines: P.string }, (element) => element.guidelines)
        .otherwise(() => undefined);
}

function getElementTitle(
    element: Readonly<ContentTypeElements.ContentTypeElementModel>,
    taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]
): string {
    return match(element)
        .returnType<string>()
        .with({ type: 'taxonomy' }, (taxonomyElement) => {
            const taxonomyGroupId = taxonomyElement.taxonomy_group?.id;

            if (!taxonomyGroupId) {
                return element.type;
            }

            const taxonomy = taxonomies.find((m) => m.id === taxonomyGroupId);
            return taxonomy?.name ?? element.type;
        })
        .with({ name: P.string }, (element) => element.name)
        .otherwise(() => 'invalidTitle');
}

function extractLinkedItemsAllowedTypes(
    element: Readonly<ContentTypeElements.ContentTypeElementModel>,
    types: readonly Readonly<ContentTypeModels.ContentType>[]
): readonly Readonly<ContentTypeModels.ContentType>[] {
    const allowedTypeIds = match(element)
        .returnType<readonly string[]>()
        .with({ type: 'modular_content' }, (linkedItemsElement) => {
            return linkedItemsElement.allowed_content_types?.map((m) => m.id).filter(isNotUndefined) ?? [];
        })
        .with({ type: 'subpages' }, (linkedItemsElement) => {
            return linkedItemsElement.allowed_content_types?.map((m) => m.id).filter(isNotUndefined) ?? [];
        })
        .with({ type: 'rich_text' }, (linkedItemsElement) => {
            return linkedItemsElement.allowed_content_types?.map((m) => m.id).filter(isNotUndefined) ?? [];
        })
        .otherwise(() => []);

    return allowedTypeIds.map((id) => types.find((m) => m.id === id)).filter(isNotUndefined);
}

function extractMultipleChoiceOptions(
    element: Readonly<ContentTypeElements.ContentTypeElementModel>
): readonly MultipleChoiceOption[] | undefined {
    return match(element)
        .returnType<readonly MultipleChoiceOption[] | undefined>()
        .with({ type: 'multiple_choice' }, (multipleChoiceElement) => {
            return multipleChoiceElement.options.map((option) => {
                return {
                    codename: option.codename ?? '',
                    name: option.name
                };
            });
        })
        .otherwise(() => undefined);
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
