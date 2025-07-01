import type { TaxonomyModels } from "@kontent-ai/management-sdk";
import { match } from "ts-pattern";
import { wrapComment } from "../../../core/comment.utils.js";
import { resolveCase } from "../../../core/resolvers.js";
import type { DeliveryEntity, DeliveryEntityType } from "../delivery-entity.generator.js";

export type TypeMappingItem = {
	readonly codename: string;
	readonly typeName: string;
};

export function deliveryEntityUtils() {
	return {
		getPluralName,
		getTypeMapping,
		getTypeMappingItem,
		getCodeOfDeliveryEntity,
		getTaxonomyTermCodenames,
		getCodenameTypeguardFunctionCode,
	};
}

function getTypeMappingTypeName(entityType: DeliveryEntityType): string {
	return `Codename${resolveCase(entityType, "pascalCase")}Mapping`;
}

function getTypeMapping(entityType: DeliveryEntityType, items: readonly TypeMappingItem[]): string {
	return `export type ${getTypeMappingTypeName(entityType)} = {
	${items.map((item) => `readonly ${item.codename}: ${item.typeName},`).join("\n")}
};`;
}

function getTypeMappingItem({
	codenamesTypeName,
	defaultTypeName,
	entityType,
}: {
	readonly entityType: DeliveryEntityType;
	readonly codenamesTypeName: string;
	readonly defaultTypeName: string;
}): string {
	const codenameGenericName = `T${resolveCase(entityType, "pascalCase")}Codename`;
	const typedItemTypeName = `Codename${resolveCase(entityType, "pascalCase")}Mapper`;
	return `export type ${typedItemTypeName}<${codenameGenericName} extends ${codenamesTypeName}> = ${codenameGenericName} extends keyof ${getTypeMappingTypeName(entityType)} ? ${getTypeMappingTypeName(entityType)}[${codenameGenericName}] : ${defaultTypeName};`;
}

function getCodenameTypeguardFunctionCode({
	codenameTypeName,
	entity,
	typeGuardName,
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
		.with("Taxonomy", () => "Taxonomies")
		.otherwise(() => `${entityType}s`);
}

function getCodeOfDeliveryEntity({
	extendedType,
	codenames,
	names,
}: {
	readonly names: {
		readonly codenamesTypeName: string;
		readonly valuesPropertyName: string;
		readonly typeGuardFunctionName: string;
	};
	readonly subtype?: "Term" | "Step";
	readonly extendedType: DeliveryEntityType | "Workflow step" | "Taxonomy term";
	readonly codenames: readonly string[];
}): string {
	const uniqueCodenames: readonly string[] = [...new Set(codenames)];

	const getCodenameTypeguardFunctionCode = (): string => {
		return `export function ${names.typeGuardFunctionName}(value: string | undefined | null): value is ${names.codenamesTypeName} {
                return typeof value === 'string' && (${names.valuesPropertyName} as readonly string[]).includes(value);
            }`;
	};

	const getValuesCode = (): string => {
		return `export const ${names.valuesPropertyName} = [${uniqueCodenames.map((m) => `'${m}'`).join(", ")}] as const;`;
	};

	const getCodenamesTypeCode = (): string => {
		return `export type ${names.codenamesTypeName} = typeof ${names.valuesPropertyName}[number];`;
	};

	const getComment = (title: string): string => {
		return wrapComment(title, {
			lines: [],
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
