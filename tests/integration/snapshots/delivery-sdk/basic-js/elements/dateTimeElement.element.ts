import type { ElementCodenames } from './_elements.js';

/**
 * Type representing codename of Date & time element Element
 *
 * Codename: date___time_element
 */
export type DateTimeElementElementCodename = Extract<ElementCodenames, 'date___time_element'>;

/**
 * Type guard for Date & time element entity
 *
 * Codename: date___time_element
 */
export function isDateTimeElementElementCodename(value: string | undefined | null): value is DateTimeElementElementCodename {
    return typeof value === 'string' && value === ('date___time_element' satisfies DateTimeElementElementCodename);
}
