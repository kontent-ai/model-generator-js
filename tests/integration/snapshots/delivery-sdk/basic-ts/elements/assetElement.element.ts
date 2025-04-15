import type { ElementCodenames } from './_elements.ts';

/**
 * Type representing codename of Asset element Element
 *
 * Codename: asset_element
 */
export type AssetElementElementCodename = Extract<ElementCodenames, 'asset_element'>;

/**
 * Type guard for Asset element entity
 *
 * Codename: asset_element
 */
export function isAssetElementElementCodename(value: string | undefined | null): value is AssetElementElementCodename {
    return typeof value === 'string' && value === ('asset_element' satisfies AssetElementElementCodename);
}
