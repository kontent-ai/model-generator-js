import { ContentTypeElements, ContentTypeSnippetModels, TaxonomyModels } from '@kontent-ai/management-sdk';
import { FlattenedElement } from './core.models.js';
import { isNotUndefined } from '@kontent-ai/migration-toolkit';

export function getFlattenedElements(
    elements: readonly Readonly<ContentTypeElements.ContentTypeElementModel>[],
    snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[],
    taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]
): readonly FlattenedElement[] {
    return elements
        .filter((element) => {
            if (element.type === 'guidelines') {
                return false;
            }

            return true;
        })
        .flatMap((element) => {
            if (element.type === 'snippet') {
                const snippet = snippets.find((snippet) => snippet.id === element.snippet.id);

                if (!snippet) {
                    throw Error(`Could not find snippet with id '${element.snippet.id}'`);
                }

                return snippet.elements;
            }

            return element;
        })
        .map((element) => {
            return getFlattenedElement(element, taxonomies);
        })
        .filter(isNotUndefined);
}

export function getFlattenedElement(
    element: Readonly<ContentTypeElements.ContentTypeElementModel>,
    taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[]
): Readonly<FlattenedElement> | undefined {
    if (!element.codename) {
        return undefined;
    }
    if (!element.id) {
        return undefined;
    }

    return {
        title: getElementTitle(element, taxonomies),
        codename: element.codename,
        id: element.id,
        type: element.type,
        isRequired: isElementRequired(element),
        guidelines: getElementGuidelines(element),
        externalId: element.external_id,
        originalElement: element
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

        if (!taxonomy) {
            return element.type;
        }

        return taxonomy.name;
    }
    return (<{ name?: string }>element).name ?? element.codename ?? 'n/a';
}
