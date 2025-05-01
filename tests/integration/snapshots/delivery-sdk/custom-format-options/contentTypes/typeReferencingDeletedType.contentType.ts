
            import type { ContentTypeCodenames } from './_contentTypes.js';
    
            /*
                * Type representing codename of Type referencing deleted type
                * 
                * Codename: type_referencing_deleted_type
                */
            export type TypeReferencingDeletedTypeContentTypeCodename = Extract<ContentTypeCodenames, 'type_referencing_deleted_type'>;

            /*
                * Type guard for Type referencing deleted type
                * 
                * Codename: type_referencing_deleted_type
            */
            export function isTypeReferencingDeletedTypeContentTypeCodename(value: string | undefined | null): value is TypeReferencingDeletedTypeContentTypeCodename {
                return typeof value === 'string' && value === ('type_referencing_deleted_type' satisfies TypeReferencingDeletedTypeContentTypeCodename);
            }
            
            