/**
 * All taxonomy codename values for Taxonomy A
 *
 * Codename: taxonomy_a
 * Id: bb37a632-3f78-48f8-ba25-7fa806d41a3e
 */
export const taxonomyAValues = ['nested_term_2', 'nested_term_1', 'term_1', 'term_2', 'term_3'] as const;

/**
 * Type representing Taxonomy A taxonomy
 *
 * Codename: taxonomy_a
 * Id: bb37a632-3f78-48f8-ba25-7fa806d41a3e
 */
export type TaxonomyA = (typeof taxonomyAValues)[number];

/**
 * Type guard for Taxonomy A
 *
 * Codename: taxonomy_a
 * Id: bb37a632-3f78-48f8-ba25-7fa806d41a3e
 */
export function isTaxonomyA(value: string | undefined | null): value is TaxonomyA {
    return typeof value === 'string' && (taxonomyAValues as readonly string[]).includes(value);
}
