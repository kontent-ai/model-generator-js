/**
 * All taxonomy codename values for ReleaseCategory
 *
 * Codename: releasecategory
 * Id: 09b6a348-0f86-7a68-4af3-7cab9a5c60b7
 */
export const releaseCategoryValues = ['global_release', 'us_only', 'local_release'] as const;

/**
 * Type representing ReleaseCategory taxonomy
 *
 * Codename: releasecategory
 * Id: 09b6a348-0f86-7a68-4af3-7cab9a5c60b7
 */
export type ReleaseCategory = (typeof releaseCategoryValues)[number];

/**
 * Type guard for ReleaseCategory
 *
 * Codename: releasecategory
 * Id: 09b6a348-0f86-7a68-4af3-7cab9a5c60b7
 */
export function isReleaseCategory(value: string | undefined | null): value is ReleaseCategory {
    return typeof value === 'string' && (releaseCategoryValues as readonly string[]).includes(value);
}
