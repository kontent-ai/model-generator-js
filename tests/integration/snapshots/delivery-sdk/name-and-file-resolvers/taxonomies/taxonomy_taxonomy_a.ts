/**
 * All taxonomy codename values for Taxonomy A
 *
 * Codename: taxonomy_a
 * Id: bb37a632-3f78-48f8-ba25-7fa806d41a3e
 */
export const Taxonomy_taxonomy_aValues = ['nested_term_2', 'nested_term_1', 'term_1', 'term_2', 'term_3'] as const;

/**
 * Type representing Taxonomy A taxonomy
 *
 * Codename: taxonomy_a
 * Id: bb37a632-3f78-48f8-ba25-7fa806d41a3e
 */
export type Taxonomy_taxonomy_a = (typeof Taxonomy_taxonomy_aValues)[number];

/**
 * Type guard for Taxonomy A
 *
 * Codename: taxonomy_a
 * Id: bb37a632-3f78-48f8-ba25-7fa806d41a3e
 */
export function isTaxonomy_taxonomy_a(value: string | undefined | null): value is Taxonomy_taxonomy_a {
    return typeof value === 'string' && (Taxonomy_taxonomy_aValues as readonly string[]).includes(value);
}
