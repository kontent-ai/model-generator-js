import type { TaxonomyModels } from '@kontent-ai/management-sdk';
import { match } from 'ts-pattern';
import { wrapComment } from '../../../core/comment.utils.js';
import type { DeliveryEntity, DeliveryEntityType } from '../delivery-entity.generator.js';

export function deliveryEntityUtils() {
    return {
        getPluralName,
        getCodeOfDeliveryEntity,
        getTaxonomyTermCodenames,
        getTypeGuardCode
    };
}

function getTypeGuardCode({
    codenameTypeName,
    entity,
    typeGuardName
}: {
    readonly typeGuardName: string;
    readonly codenameTypeName: string;
    readonly entity: Readonly<DeliveryEntity>;
}): string {
    return `export function ${typeGuardName}(value: string | undefined | null): value is ${codenameTypeName} {
                return typeof value === 'string' && value === ('${entity.codename}' satisfies ${codenameTypeName});
            }`;
}

function getTaxonomyTermCodenames(taxonomyTerms: readonly Readonly<TaxonomyModels.Taxonomy>[]): readonly string[] {
    const termCodenames = taxonomyTerms.reduce<readonly string[]>((codenames, taxonomyTerm) => {
        return codenames.concat(getTaxonomyTermCodenames(taxonomyTerm.terms), taxonomyTerm.codename);
    }, []);

    return [...new Set(termCodenames)];
}

function getPluralName(entityName: DeliveryEntityType): string {
    return match(entityName)
        .returnType<string>()
        .with('Taxonomy', () => 'Taxonomies')
        .otherwise(() => `${entityName}s`);
}

function getCodeOfDeliveryEntity({
    originalName,
    type,
    codenames,
    names
}: {
    readonly names: {
        readonly codenamesTypeName: string;
        readonly valuesPropertyName: string;
        readonly typeGuardFunctionName: string;
    };
    readonly originalName: string | undefined;
    readonly type: DeliveryEntityType;
    readonly codenames: readonly string[];
}): string {
    const uniqueCodenames: readonly string[] = [...new Set(codenames)];

    const getTypeGuardFunction = (): string => {
        return `export function ${names.typeGuardFunctionName}(value: string | undefined | null): value is ${names.codenamesTypeName} {
                return typeof value === 'string' && (${names.valuesPropertyName} as readonly string[]).includes(value);
            }`;
    };

    const getValuesCode = (): string => {
        return `export const ${names.valuesPropertyName} = [${uniqueCodenames.map((m) => `'${m}'`).join(', ')}] as const;`;
    };

    return `
            ${wrapComment(`
                * Object with all values of ${type} codenames ${originalName ? `in ${originalName}` : ''}
            `)}
            ${getValuesCode()};

            ${wrapComment(`
                * Type representing ${type} codenames ${originalName ? `in ${originalName}` : ''}
            `)}
            export type ${names.codenamesTypeName} = typeof ${names.valuesPropertyName}[number];

            ${wrapComment(`
                * Type guard for ${type} codenames ${originalName ? `in ${originalName}` : ''}
            `)}
            ${getTypeGuardFunction()};`;
}
