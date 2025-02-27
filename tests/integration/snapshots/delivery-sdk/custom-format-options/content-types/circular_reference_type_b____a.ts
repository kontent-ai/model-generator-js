
import type { Elements } from '@kontent-ai/delivery-sdk';
import type { CircularReferenceTypeAB } from './index.js';
import type { CoreContentType } from '../system/index.js';

/**
* Circular reference type B -> A
* 
* Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
* Codename: circular_reference_type_b____a    
*/
export type CircularReferenceTypeBA = CoreContentType<
CircularReferenceTypeBAElementCodenames,
{
                /**
                * Items
                * 
                * Type: modular_content
                * Required: false
                * Codename: items
                * Id: 019714f7-8c50-492b-8e5c-f7c3d7e2529b
                */ 
                readonly items: Elements.LinkedItemsElement<CircularReferenceTypeAB>;}, 
'circular_reference_type_b____a'>

/**
* Type representing all available element codenames for Circular reference type B -> A
*/
export type CircularReferenceTypeBAElementCodenames = 'items';;

/**
* Type guard for Circular reference type B -> A
*
* Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
* Codename: circular_reference_type_b____a
*/
export function isCircularReferenceTypeBA(item: CoreContentType | undefined | null): item is CircularReferenceTypeBA {
                return item?.system?.type === 'circular_reference_type_b____a';
            };
