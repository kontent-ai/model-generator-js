/**
 * All taxonomy codename values for Taxonomy without terms
 *
 * Codename: taxonomy_without_terms
 * Id: 01878d46-fcbc-4211-a801-676ad4e72cb2
 */
export const Taxonomy_taxonomy_without_termsValues = [] as const;

/**
 * Type representing Taxonomy without terms taxonomy
 *
 * Codename: taxonomy_without_terms
 * Id: 01878d46-fcbc-4211-a801-676ad4e72cb2
 */
export type Taxonomy_taxonomy_without_terms = (typeof Taxonomy_taxonomy_without_termsValues)[number];

/**
 * Type guard for Taxonomy without terms
 *
 * Codename: taxonomy_without_terms
 * Id: 01878d46-fcbc-4211-a801-676ad4e72cb2
 */
export function isTaxonomy_taxonomy_without_terms(value: string | undefined | null): value is Taxonomy_taxonomy_without_terms {
    return typeof value === 'string' && (Taxonomy_taxonomy_without_termsValues as readonly string[]).includes(value);
}
