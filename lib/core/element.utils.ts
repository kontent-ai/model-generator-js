import { ContentTypeElements, TaxonomyModels } from '@kontent-ai/management-sdk';
import { FlattenedElement } from './core.models.js';

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
        guidelines: getElementGuidelines(element)
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
