import type { ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels, WorkflowModels } from "@kontent-ai/management-sdk";
import {
	type FilenameResolver,
	mapFilename,
	mapName,
	type NameResolver,
	type ObjectWithCodename,
	resolveCase,
} from "@kontent-ai/model-generator-shared";
import type { DeliveryGeneratorConfig, DeliveryNameResolvers } from "./delivery.generator.js";
import type { DeliveryEntity, DeliveryEntityType } from "./delivery-entity.generator.js";
import { deliveryEntityUtils } from "./utils/delivery-entity.utils.js";

type DeliveryEntityBaseNames = {
	readonly codenamesValuePropertyName: string;
	readonly codenamesTypeName: string;
	readonly codenamesTypeguardFunctionName: string;

	readonly overviewFilename: string;
	readonly folderName: string;

	readonly getEntityName: (entity: Readonly<DeliveryEntity>) => string;
	readonly getEntityBaseName: (entity: Readonly<DeliveryEntity>) => string;
	readonly getEntityFilename: (entity: Readonly<DeliveryEntity>, addExtension: boolean) => string;
	readonly getCodenameTypeName: (entity: Readonly<DeliveryEntity>) => string;
	readonly getTypeguardFunctionName: (entity: Readonly<DeliveryEntity>) => string;
};

type AdditionalEntityNamesMap = {
	readonly Taxonomy: {
		readonly termsNames: {
			readonly valuesPropertyName: (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
			readonly codenamesTypeName: (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
			readonly typeguardFunctionName: (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
		};
	};
	readonly Workflow: {
		readonly allStepsNames: {
			readonly valuesPropertyName: string;
			readonly codenamesTypeName: string;
			readonly typeguardFunctionName: string;
		};
		readonly stepsNames: {
			readonly valuesPropertyName: (workflow: Readonly<WorkflowModels.Workflow>) => string;
			readonly codenamesTypeName: (workflow: Readonly<WorkflowModels.Workflow>) => string;
			readonly typeguardFunctionName: (workflow: Readonly<WorkflowModels.Workflow>) => string;
		};
	};
	readonly Type: {
		readonly typeNames: {
			readonly typeguardFunctionName: (type: Readonly<ContentTypeModels.ContentType>) => string;
		};
	};
	readonly Snippet: {
		readonly snippetItemNames: {
			readonly typeguardFunctionName: (snippet: Readonly<ContentTypeSnippetModels.ContentTypeSnippet>) => string;
		};
	};
	readonly Language: NonNullable<unknown>;
	readonly Collection: NonNullable<unknown>;
	readonly Element: NonNullable<unknown>;
};

export type AdditionalEntityNames<T extends DeliveryEntityType> = AdditionalEntityNamesMap[T];

export type DeliveryEntityNames<T extends DeliveryEntityType> = DeliveryEntityBaseNames & AdditionalEntityNames<T>;

type EntityResolvers = {
	readonly nameResolver: NonNullable<NameResolver<DeliveryEntity>>;
	readonly filenameResolver: NonNullable<FilenameResolver<DeliveryEntity>>;
};

// Key of the user-provided resolver (in both 'nameResolvers' and 'fileResolvers') for each entity type
const resolverKeys = {
	Type: "contentType",
	Snippet: "snippet",
	Taxonomy: "taxonomy",
	Language: "language",
	Workflow: "workflow",
	Collection: "collection",
	Element: undefined,
} as const satisfies Record<DeliveryEntityType, keyof DeliveryNameResolvers | undefined>;

export function getDeliveryEntityNamesGenerator<T extends DeliveryEntityType>(config: {
	readonly nameResolvers: Pick<DeliveryGeneratorConfig, "nameResolvers">["nameResolvers"];
	readonly fileResolvers: Pick<DeliveryGeneratorConfig, "fileResolvers">["fileResolvers"];
	readonly entityType: T;
}) {
	const deliveryUtils = deliveryEntityUtils();

	return {
		getEntityNames: (): DeliveryEntityNames<T> => {
			const { filenameResolver, nameResolver } = getNameAndFilenameResolver(config);

			const entityTypeName = {
				camelCase: resolveCase(config.entityType, "camelCase"),
				pascalCase: resolveCase(config.entityType, "pascalCase"),
				pluralCamelCase: resolveCase(deliveryUtils.getPluralName(config.entityType), "camelCase"),
			};

			const baseNames: DeliveryEntityBaseNames = {
				codenamesTypeName: `${entityTypeName.pascalCase}Codenames`,
				codenamesValuePropertyName: `${entityTypeName.camelCase}Codenames`,
				codenamesTypeguardFunctionName: `is${entityTypeName.pascalCase}Codename`,

				overviewFilename: mapFilename<ObjectWithCodename>((c) => c.codename)({ codename: entityTypeName.pluralCamelCase }, true),
				folderName: entityTypeName.pluralCamelCase,

				// Content types name the runtime item type with an 'Item' suffix (e.g. 'MovieItem'); the bare base name
				// (e.g. 'Movie') is used for codename/element-codename/multiple-choice types.
				getEntityName: mapName(nameResolver, "pascalCase", config.entityType === "Type" ? { suffix: "Item" } : undefined),
				getEntityBaseName: mapName(nameResolver, "pascalCase"),
				getCodenameTypeName: mapName(nameResolver, "pascalCase", { suffix: "Codename" }),
				getTypeguardFunctionName: mapName(nameResolver, "pascalCase", {
					prefix: "is",
					suffix: "Codename",
				}),
				getEntityFilename: mapFilename(filenameResolver, {}),
			};

			return {
				...baseNames,
				...getAdditionalEntityNames(config.entityType, nameResolver),
			};
		},
	};
}

function getAdditionalEntityNames<T extends DeliveryEntityType>(
	entityType: T,
	nameResolver: NonNullable<NameResolver<DeliveryEntity>>,
): AdditionalEntityNames<T> {
	const additionalNames: { readonly [K in DeliveryEntityType]: () => AdditionalEntityNamesMap[K] } = {
		Taxonomy: () => ({
			termsNames: {
				valuesPropertyName: mapName(nameResolver, "camelCase", { suffix: "TermCodenames" }),
				codenamesTypeName: mapName(nameResolver, "pascalCase", { suffix: "TermCodenames" }),
				typeguardFunctionName: mapName(nameResolver, "pascalCase", { prefix: "is", suffix: "TermCodename" }),
			},
		}),
		Workflow: () => ({
			stepsNames: {
				valuesPropertyName: mapName(nameResolver, "camelCase", { suffix: "StepCodenames" }),
				codenamesTypeName: mapName(nameResolver, "pascalCase", { suffix: "StepCodenames" }),
				typeguardFunctionName: mapName(nameResolver, "pascalCase", { prefix: "is", suffix: "StepCodename" }),
			},
			allStepsNames: {
				valuesPropertyName: resolveCase("workflowStepCodenames", "camelCase"),
				codenamesTypeName: resolveCase("workflowStepCodenames", "pascalCase"),
				typeguardFunctionName: resolveCase("isWorkflowStepCodename", "camelCase"),
			},
		}),
		Type: () => ({
			typeNames: {
				typeguardFunctionName: mapName(nameResolver, "pascalCase", { prefix: "is", suffix: "Item" }),
			},
		}),
		Snippet: () => ({
			snippetItemNames: {
				typeguardFunctionName: mapName(nameResolver, "pascalCase", { prefix: "is" }),
			},
		}),
		Language: () => ({}),
		Collection: () => ({}),
		Element: () => ({}),
	};

	return additionalNames[entityType]();
}

function getNameAndFilenameResolver(config: {
	readonly nameResolvers: Pick<DeliveryGeneratorConfig, "nameResolvers">["nameResolvers"];
	readonly fileResolvers: Pick<DeliveryGeneratorConfig, "fileResolvers">["fileResolvers"];
	readonly entityType: DeliveryEntityType;
}): EntityResolvers {
	const resolverKey = resolverKeys[config.entityType];

	if (!resolverKey) {
		// elements are always named by their codename
		return {
			nameResolver: (item) => item.codename,
			filenameResolver: (item) => item.codename,
		};
	}

	// User resolvers are typed for a single entity model (e.g. 'ContentType'), but are only ever called with entities of that type
	const customNameResolver = config.nameResolvers?.[resolverKey] as NameResolver<DeliveryEntity>;
	const customFilenameResolver = config.fileResolvers?.[resolverKey] as FilenameResolver<DeliveryEntity>;

	return {
		// Content types use the bare name as the base (e.g. 'Movie'); the 'Item'/'Codename' suffixes are added by
		// the individual name accessors. The filename keeps the '.Type' suffix (e.g. 'movie-type.generated.ts').
		nameResolver:
			customNameResolver ?? (config.entityType === "Type" ? (item) => item.name : (item) => `${item.name}${config.entityType}`),
		filenameResolver: customFilenameResolver ?? ((item) => `${item.name}.${config.entityType}`),
	};
}
