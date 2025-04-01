/**
 * All taxonomy codename values for Taxonomy without terms
 *
 * Codename: taxonomy_without_terms
 * Id: 01878d46-fcbc-4211-a801-676ad4e72cb2
 */
export const taxonomyWithoutTermsValues = [] as const;

/**
 * Type representing Taxonomy without terms taxonomy
 *
 * Codename: taxonomy_without_terms
 * Id: 01878d46-fcbc-4211-a801-676ad4e72cb2
 */
export type TaxonomyWithoutTerms = (typeof taxonomyWithoutTermsValues)[number];

/**
 * Type guard for Taxonomy without terms
 *
 * Codename: taxonomy_without_terms
 * Id: 01878d46-fcbc-4211-a801-676ad4e72cb2
 */
export function isTaxonomyWithoutTerms(value: string | undefined | null): value is TaxonomyWithoutTerms {
    return typeof value === 'string' && (taxonomyWithoutTermsValues as readonly string[]).includes(value);
}
