
            import type { TypeCodenames } from './_types.js';
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CircularReferenceTypeBAType } from './index.js';
import type { CoreType } from '../system/index.js';
           
            /*
* Type representing codename of 'Circular reference type A > B' type
*/
            export type CircularReferenceTypeABTypeCodename = Extract<TypeCodenames, 'circular_reference_type_a_b'>;

            /*
* Typeguard for codename of 'Circular reference type A > B' type
*/
            export function isCircularReferenceTypeABTypeCodename(value: string | undefined | null): value is CircularReferenceTypeABTypeCodename {
                return typeof value === 'string' && value === ('circular_reference_type_a_b' satisfies CircularReferenceTypeABTypeCodename);
            }

/*
    * Circular reference type A > B
    *
    * Id: a58680f7-0667-4a0e-8dc2-889233bdbf71
* Codename: circular_reference_type_a_b
    */
export type CircularReferenceTypeABType = CoreType<
CircularReferenceTypeABTypeElementCodenames,
{
/*
    * Items
    *
    * Codename: items
* Id: 33ab92dd-e47d-45e2-a060-3b5df0754c24
* Type: modular_content
* Required: false
* Allowed content types: circular_reference_type_b____a
    */
                readonly items: Elements.LinkedItemsElement<CircularReferenceTypeBAType>;}, 
CircularReferenceTypeABTypeCodename>

/*
* Type representing all available element codenames for Circular reference type A > B
*/
export type CircularReferenceTypeABTypeElementCodenames = 'items';;

/*
    * Type guard for Circular reference type A > B
    *
    * Id: a58680f7-0667-4a0e-8dc2-889233bdbf71
* Codename: circular_reference_type_a_b
    */
export function isCircularReferenceTypeABType(item: CoreType | undefined | null): item is CircularReferenceTypeABType {
                return item?.system.type === ('circular_reference_type_a_b' satisfies CircularReferenceTypeABTypeCodename);
            };



            