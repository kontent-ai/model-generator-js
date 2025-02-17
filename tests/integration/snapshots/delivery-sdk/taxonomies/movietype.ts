/**
 * All taxonomy codename values for MovieType
 *
 * Codename: movietype
 * Id: 365a17e6-1929-27ab-9f67-a9273c846717
 */
export const movieTypeValues = ['student', 'tv', 'blockbuster', 'cinema_only', 'film'] as const;

/**
 * Type representing MovieType taxonomy
 *
 * Codename: movietype
 * Id: 365a17e6-1929-27ab-9f67-a9273c846717
 */
export type MovieType = (typeof movieTypeValues)[number];

/**
 * Type guard for MovieType
 *
 * Codename: movietype
 * Id: 365a17e6-1929-27ab-9f67-a9273c846717
 */
export function isMovieType(value: string | undefined | null): value is MovieType {
    return typeof value === 'string' && (movieTypeValues as readonly string[]).includes(value);
}
