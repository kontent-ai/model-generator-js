import type { ContentTypeModels, TaxonomyModels, WorkflowModels } from "@kontent-ai/management-sdk";
import { match } from "ts-pattern";
import type { ObjectWithCodename } from "../../core/core.models.js";
import { type FilenameResolver, mapFilename, mapName, type NameResolver, resolveCase } from "../../core/resolvers.js";
import type { DeliveryGeneratorConfig } from "./delivery.generator.js";
import type { DeliveryEntity, DeliveryEntityType } from "./delivery-entity.generator.js";
import { deliveryEntityUtils } from "./utils/delivery-entity.utils.js";

export type DeliveryEntityNames<T extends DeliveryEntityType> = {
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
} & AdditionalEntityNames<T>;

export type AdditionalEntityNames<T> = T extends "Taxonomy"
	? {
			readonly termsNames: {
				readonly valuesPropertyName: (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
				readonly codenamesTypeName: (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
				readonly typeguardFunctionName: (taxonomy: Readonly<TaxonomyModels.Taxonomy>) => string;
			};
		}
	: T extends "Workflow"
		? {
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
			}
		: T extends "Type"
			? {
					readonly typeNames: {
						readonly contentItemTypeguardFunctionName: (type: Readonly<ContentTypeModels.ContentType>) => string;
					};
				}
			: NonNullable<unknown>;

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

			const entityNames: DeliveryEntityNames<DeliveryEntityType> = {
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
				termsNames:
					config.entityType === "Taxonomy"
						? {
								valuesPropertyName: mapName(nameResolver, "camelCase", { suffix: "TermCodenames" }),
								codenamesTypeName: mapName(nameResolver, "pascalCase", { suffix: "TermCodenames" }),
								typeguardFunctionName: mapName(nameResolver, "pascalCase", { prefix: "is", suffix: "TermCodename" }),
							}
						: undefined,
				stepsNames:
					config.entityType === "Workflow"
						? {
								valuesPropertyName: mapName(nameResolver, "camelCase", { suffix: "StepCodenames" }),
								codenamesTypeName: mapName(nameResolver, "pascalCase", { suffix: "StepCodenames" }),
								typeguardFunctionName: mapName(nameResolver, "pascalCase", { prefix: "is", suffix: "StepCodename" }),
							}
						: undefined,
				allStepsNames:
					config.entityType === "Workflow"
						? {
								valuesPropertyName: resolveCase("workflowStepCodenames", "camelCase"),
								codenamesTypeName: resolveCase("workflowStepCodenames", "pascalCase"),
								typeguardFunctionName: resolveCase("isWorkflowStepCodename", "camelCase"),
							}
						: undefined,
				typeNames:
					config.entityType === "Type"
						? {
								contentItemTypeguardFunctionName: mapName(nameResolver, "pascalCase", { prefix: "is", suffix: "Item" }),
							}
						: undefined,
			};

			return entityNames as DeliveryEntityNames<T>;
		},
	};
}

function getNameAndFilenameResolver<T extends DeliveryEntityType>(config: {
	readonly nameResolvers: Pick<DeliveryGeneratorConfig, "nameResolvers">["nameResolvers"];
	readonly fileResolvers: Pick<DeliveryGeneratorConfig, "fileResolvers">["fileResolvers"];
	readonly entityType: T;
}): {
	readonly nameResolver: NonNullable<NameResolver<DeliveryEntity>>;
	readonly filenameResolver: NonNullable<FilenameResolver<DeliveryEntity>>;
} {
	const defaultNameResolver = (item: DeliveryEntity) => `${item.name}${config.entityType}`;
	const defaultFilenameResolver = (item: DeliveryEntity) => `${item.name}.${config.entityType}`;

	return match<DeliveryEntityType>(config.entityType)
		.returnType<{
			readonly nameResolver: NonNullable<NameResolver<DeliveryEntity>>;
			readonly filenameResolver: NonNullable<FilenameResolver<DeliveryEntity>>;
		}>()
		.with("Type", () => ({
			// Content types use the bare name as the base (e.g. 'Movie'); the 'Item'/'Codename' suffixes are added by
			// the individual name accessors. The filename keeps the '.Type' suffix (e.g. 'movie-type.generated.ts').
			nameResolver: config.nameResolvers?.contentType
				? (config.nameResolvers.contentType as NonNullable<NameResolver<DeliveryEntity>>)
				: (item: DeliveryEntity) => item.name,
			filenameResolver: config.fileResolvers?.contentType
				? (config.fileResolvers.contentType as NonNullable<FilenameResolver<DeliveryEntity>>)
				: defaultFilenameResolver,
		}))
		.with("Snippet", () => ({
			nameResolver: config.nameResolvers?.snippet
				? (config.nameResolvers.snippet as NonNullable<NameResolver<DeliveryEntity>>)
				: defaultNameResolver,
			filenameResolver: config.fileResolvers?.snippet
				? (config.fileResolvers.snippet as NonNullable<FilenameResolver<DeliveryEntity>>)
				: defaultFilenameResolver,
		}))
		.with("Taxonomy", () => ({
			nameResolver: config.nameResolvers?.taxonomy
				? (config.nameResolvers.taxonomy as NonNullable<NameResolver<DeliveryEntity>>)
				: defaultNameResolver,
			filenameResolver: config.fileResolvers?.taxonomy
				? (config.fileResolvers.taxonomy as NonNullable<FilenameResolver<DeliveryEntity>>)
				: defaultFilenameResolver,
		}))
		.with("Language", () => ({
			nameResolver: config.nameResolvers?.language
				? (config.nameResolvers.language as NonNullable<NameResolver<DeliveryEntity>>)
				: defaultNameResolver,
			filenameResolver: config.fileResolvers?.language
				? (config.fileResolvers.language as NonNullable<FilenameResolver<DeliveryEntity>>)
				: defaultFilenameResolver,
		}))
		.with("Workflow", () => ({
			nameResolver: config.nameResolvers?.workflow
				? (config.nameResolvers.workflow as NonNullable<NameResolver<DeliveryEntity>>)
				: defaultNameResolver,
			filenameResolver: config.fileResolvers?.workflow
				? (config.fileResolvers.workflow as NonNullable<FilenameResolver<DeliveryEntity>>)
				: defaultFilenameResolver,
		}))
		.with("Collection", () => ({
			nameResolver: config.nameResolvers?.collection
				? (config.nameResolvers.collection as NonNullable<NameResolver<DeliveryEntity>>)
				: defaultNameResolver,
			filenameResolver: config.fileResolvers?.collection
				? (config.fileResolvers.collection as NonNullable<FilenameResolver<DeliveryEntity>>)
				: defaultFilenameResolver,
		}))
		.with("Element", () => ({
			nameResolver: (item) => item.codename,
			filenameResolver: (item) => item.codename,
		}))
		.exhaustive();
}
