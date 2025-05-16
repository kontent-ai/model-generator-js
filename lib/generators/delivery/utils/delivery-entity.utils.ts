import type { TaxonomyModels } from '@kontent-ai/management-sdk';
import { match } from 'ts-pattern';
import { wrapComment } from '../../../core/comment.utils.js';
import type { DeliveryEntity, DeliveryEntityType } from '../delivery-entity.generator.js';

export function deliveryEntityUtils() {
    return {
        getPluralName,
        getCodeOfDeliveryEntity,
        getTaxonomyTermCodenames,
        getCodenameTypeguardFunctionCode
    };
}

function getCodenameTypeguardFunctionCode({
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

function getPluralName(entityType: DeliveryEntityType): string {
    return match(entityType)
        .returnType<string>()
        .with('Taxonomy', () => 'Taxonomies')
        .otherwise(() => `${entityType}s`);
}

function getCodeOfDeliveryEntity({
    extendedType,
    codenames,
    names
}: {
    readonly names: {
        readonly codenamesTypeName: string;
        readonly valuesPropertyName: string;
        readonly typeGuardFunctionName: string;
    };
    readonly subtype?: 'Term' | 'Step';
    readonly extendedType: DeliveryEntityType | 'Workflow step' | 'Taxonomy term';
    readonly codenames: readonly string[];
}): string {
    const uniqueCodenames: readonly string[] = [...new Set(codenames)];

    const getCodenameTypeguardFunctionCode = (): string => {
        return `export function ${names.typeGuardFunctionName}(value: string | undefined | null): value is ${names.codenamesTypeName} {
                return typeof value === 'string' && (${names.valuesPropertyName} as readonly string[]).includes(value);
            }`;
    };

    const getValuesCode = (): string => {
        return `export const ${names.valuesPropertyName} = [${uniqueCodenames.map((m) => `'${m}'`).join(', ')}] as const;`;
    };

    const getCodenamesTypeCode = (): string => {
        return `export type ${names.codenamesTypeName} = typeof ${names.valuesPropertyName}[number];`;
    };

    const getComment = (title: string): string => {
        return wrapComment(title, {
            lines: []
        });
    };

    const getEntityTypeNameForComments = (): string => `${extendedType.toLowerCase()}`;

    return `
            ${getComment(`Array of all ${getEntityTypeNameForComments()} codenames`)}
            ${getValuesCode()};
           
            ${getComment(`Type representing all ${getEntityTypeNameForComments()} codenames`)}
            ${getCodenamesTypeCode()};

            ${getComment(`Typeguard for ${getEntityTypeNameForComments()} codename`)}
            ${getCodenameTypeguardFunctionCode()};`;
}
