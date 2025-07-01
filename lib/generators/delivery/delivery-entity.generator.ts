import type { CollectionModels, LanguageModels } from "@kontent-ai/management-sdk";
import { ContentTypeModels, ContentTypeSnippetModels, TaxonomyModels, WorkflowModels } from "@kontent-ai/management-sdk";
import { P, match } from "ts-pattern";
import { deliveryConfig } from "../../config.js";
import { wrapComment } from "../../core/comment.utils.js";
import type { GeneratedFile, GeneratedSet, GeneratedTypeModel, ModuleFileExtension } from "../../core/core.models.js";
import { isNotUndefined } from "../../core/core.utils.js";
import { getImporter } from "../../core/importer.js";
import type { DeliveryEntityNames } from "./delivery-entity-name.generator.js";
import { getDeliveryEntityNamesGenerator } from "./delivery-entity-name.generator.js";
import { getDeliveryTypeAndSnippetGenerator } from "./delivery-type-and-snippet.generator.js";
import type { DeliveryGeneratorConfig } from "./delivery.generator.js";
import { deliveryEntityUtils } from "./utils/delivery-entity.utils.js";

export type DeliveryElement = {
	readonly codename: string;
	readonly name: string;
	readonly externalId: string | undefined;
};

export type DeliveryEntity =
	| Readonly<LanguageModels.LanguageModel>
	| Readonly<CollectionModels.Collection>
	| Readonly<WorkflowModels.Workflow>
	| Readonly<TaxonomyModels.Taxonomy>
	| DeliveryElement
	| Readonly<ContentTypeModels.ContentType>
	| Readonly<ContentTypeSnippetModels.ContentTypeSnippet>;

export type DeliveryEntityType = "Language" | "Collection" | "Workflow" | "Taxonomy" | "Type" | "Element" | "Snippet";

export type DeliveryEntityGeneratorConfig<T extends DeliveryEntityType> = {
	readonly moduleFileExtension: ModuleFileExtension;
	readonly entityType: T;
	readonly entities: readonly Readonly<DeliveryEntity>[];
	readonly generateOnlyOverviewFile: boolean;
	readonly deliveryGeneratorConfig: DeliveryGeneratorConfig;
};

export type DeliveryEntityGenerator<T extends DeliveryEntityType> = {
	readonly entityType: T;
	readonly generateEntityTypes: () => GeneratedSet;
	readonly entityNames: DeliveryEntityNames<T>;
	readonly generateOverviewFile: () => GeneratedFile;
};

export function getDeliveryEntityGenerator<T extends DeliveryEntityType>(
	config: DeliveryEntityGeneratorConfig<T>,
): DeliveryEntityGenerator<T> {
	const importer = getImporter(config.moduleFileExtension);
	const deliveryUtils = deliveryEntityUtils();
	const entityNames = getDeliveryEntityNamesGenerator({
		...{
			nameResolvers: config.deliveryGeneratorConfig.nameResolvers,
			fileResolvers: config.deliveryGeneratorConfig.fileResolvers,
		},
		entityType: config.entityType,
	}).getEntityNames();

	const getEntityComment: (title: string) => string = (title) => {
		return wrapComment(title, {
			lines: [],
		});
	};

	const getEntityTypeNameForComment = (): string => {
		return config.entityType.toLowerCase();
	};

	const getEntityTypeGuardFunction = (entity: Readonly<DeliveryEntity>): string => {
		return deliveryUtils.getCodenameTypeguardFunctionCode({
			codenameTypeName: entityNames.getCodenameTypeName(entity),
			typeGuardName: entityNames.getTypeguardFunctionName(entity),
			entity,
		});
	};

	const getOverviewFileCode = (): string => {
		const { imports, code: extraCode } = getOverviewFileExtraCode() ?? {};

		return `
            ${imports?.length ? `${imports.join("\n")}\n` : ""}${deliveryUtils.getCodeOfDeliveryEntity({
				codenames: config.entities.map((m) => m.codename),
				names: {
					codenamesTypeName: entityNames.codenamesTypeName,
					typeGuardFunctionName: entityNames.codenamesTypeguardFunctionName,
					valuesPropertyName: entityNames.codenamesValuePropertyName,
				},
				extendedType: config.entityType,
			})}${extraCode?.length ? `\n${extraCode}` : ""}`;
	};

	const getEntityCode = (entity: Readonly<DeliveryEntity>): string => {
		const extraCode = getEntityExtraCode(entity);

		const getEntityTypeCode = (): string => {
			return `export type ${entityNames.getCodenameTypeName(entity)} = keyof Pick<Record<${entityNames.codenamesTypeName}, null>, "${entity.codename}">;`;
		};

		return `
            ${importer.importType({
				filePathOrPackage: `../${deliveryConfig.systemTypesFolderName}/${entityNames.overviewFilename}`,
				importValue: `${entityNames.codenamesTypeName}`,
			})}${extraCode?.imports.length ? `\n${extraCode.imports.join("\n")}` : ""}
           
            ${getEntityComment(`Type representing codename of '${entity.name}' ${getEntityTypeNameForComment()}`)}
            ${getEntityTypeCode()}

            ${getEntityComment(`Typeguard for codename of '${entity.name}' ${getEntityTypeNameForComment()}`)}
            ${getEntityTypeGuardFunction(entity)}${extraCode ? `\n${extraCode.code}` : ""}
            `;
	};

	const getEntityFile = (entity: Readonly<DeliveryEntity>): GeneratedFile => {
		return {
			filename: entityNames.getEntityFilename(entity, true),
			text: getEntityCode(entity),
		};
	};

	const getOverviewEntityFile = (): GeneratedFile => {
		return {
			filename: entityNames.overviewFilename,
			text: getOverviewFileCode(),
		};
	};

	const getOverviewFileExtraCode = ():
		| {
				readonly imports: readonly string[];
				readonly code: string;
		  }
		| undefined => {
		return match<DeliveryEntityType>(config.entityType)
			.returnType<
				| {
						readonly imports: readonly string[];
						readonly code: string;
				  }
				| undefined
			>()
			.with("Workflow", (workflowDeliveryType) => {
				const workflowStepCodenames: readonly string[] = config.entities
					.filter((m) => m instanceof WorkflowModels.Workflow)
					.flatMap((workflow) =>
						[...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep].filter(isNotUndefined),
					)
					.map((m) => m.codename);

				const worfklowStepNames = getDeliveryEntityNamesGenerator({
					...{
						nameResolvers: config.deliveryGeneratorConfig.nameResolvers ?? undefined,
						fileResolvers: config.deliveryGeneratorConfig.fileResolvers ?? undefined,
					},
					entityType: workflowDeliveryType,
				}).getEntityNames();

				return {
					imports: [],
					code: deliveryUtils.getCodeOfDeliveryEntity({
						codenames: workflowStepCodenames,
						names: {
							codenamesTypeName: worfklowStepNames.allStepsNames.codenamesTypeName,
							typeGuardFunctionName: worfklowStepNames.allStepsNames.typeguardFunctionName,
							valuesPropertyName: worfklowStepNames.allStepsNames.valuesPropertyName,
						},
						extendedType: workflowDeliveryType,
					}),
				};
			})
			.with("Type", (contentTypeDeliveryType) => {
				return {
					imports: [
						...config.entities
							.filter((m) => m instanceof ContentTypeModels.ContentType)
							.map((type) => {
								return importer.importType({
									filePathOrPackage: `../${entityNames.folderName}/${entityNames.getEntityFilename(type, true)}`,
									importValue: `${entityNames.getEntityName(type)}`,
								});
							}),
					],
					code: `
					 ${wrapComment(`Core content type with narrowed types. Use this instead of'${deliveryConfig.sdkTypes.contentItem}' for increased type safety.`)}
					 ${deliveryUtils.getCoreContentTypeCode(
							config.entities.filter((m) => m instanceof ContentTypeModels.ContentType),
							entityNames as DeliveryEntityNames<"Type">,
						)}

					${getEntityComment("Type mapping for codename & type. Can be used for type safe access to type based on the codename of type.")}
					${deliveryUtils.getTypeMapping(
						contentTypeDeliveryType,
						config.entities.map((m) => ({
							codename: m.codename,
							typeName: entityNames.getEntityName(m),
						})),
					)}

					${getEntityComment("Helper type that returns type based on the codename of type.")}
					${deliveryUtils.getTypeMappingItem({
						codenamesTypeName: entityNames.codenamesTypeName,
						defaultTypeName: "CoreType",
						entityType: contentTypeDeliveryType,
					})}
					`,
				};
			})
			.otherwise(() => undefined);
	};

	const getEntityExtraCode = (entity: DeliveryEntity): GeneratedTypeModel | undefined => {
		return match(entity)
			.returnType<GeneratedTypeModel | undefined>()
			.with(P.instanceOf(WorkflowModels.Workflow), (workflow) => {
				const worfklowStepNames = getDeliveryEntityNamesGenerator({
					...{
						nameResolvers: config.deliveryGeneratorConfig.nameResolvers ?? undefined,
						fileResolvers: config.deliveryGeneratorConfig.fileResolvers ?? undefined,
					},
					entityType: "Workflow",
				}).getEntityNames();

				return {
					imports: [],
					code: deliveryUtils.getCodeOfDeliveryEntity({
						codenames: [
							...workflow.steps.map((m) => m.codename),
							workflow.publishedStep.codename,
							workflow.archivedStep.codename,
							workflow.scheduledStep.codename,
						].filter(isNotUndefined),
						names: {
							codenamesTypeName: worfklowStepNames.stepsNames.codenamesTypeName(workflow),
							typeGuardFunctionName: worfklowStepNames.stepsNames.typeguardFunctionName(workflow),
							valuesPropertyName: worfklowStepNames.stepsNames.valuesPropertyName(workflow),
						},
						extendedType: "Workflow step",
					}),
				};
			})
			.with(P.instanceOf(TaxonomyModels.Taxonomy), (taxonomy) => {
				const termEntityNames = getDeliveryEntityNamesGenerator({
					...{
						nameResolvers: config.deliveryGeneratorConfig.nameResolvers ?? undefined,
						fileResolvers: config.deliveryGeneratorConfig.fileResolvers ?? undefined,
					},
					entityType: "Taxonomy",
				}).getEntityNames();

				return {
					imports: [],
					code: deliveryUtils.getCodeOfDeliveryEntity({
						codenames: deliveryUtils.getTaxonomyTermCodenames(taxonomy.terms),
						names: {
							codenamesTypeName: termEntityNames.termsNames.codenamesTypeName(taxonomy),
							typeGuardFunctionName: termEntityNames.termsNames.typeguardFunctionName(taxonomy),
							valuesPropertyName: termEntityNames.termsNames.valuesPropertyName(taxonomy),
						},
						extendedType: "Taxonomy term",
					}),
				};
			})
			.with(P.instanceOf(ContentTypeModels.ContentType), (contentType) =>
				getDeliveryTypeAndSnippetGenerator(config.deliveryGeneratorConfig).generateTypeModel(contentType),
			)
			.with(P.instanceOf(ContentTypeSnippetModels.ContentTypeSnippet), (contentTypeSnippet) =>
				getDeliveryTypeAndSnippetGenerator(config.deliveryGeneratorConfig).generateSnippetModel(contentTypeSnippet),
			)
			.otherwise(() => undefined);
	};

	return {
		entityNames,
		entityType: config.entityType,
		generateOverviewFile: (): GeneratedFile => {
			return getOverviewEntityFile();
		},
		generateEntityTypes: (): GeneratedSet => {
			return {
				folderName: entityNames.folderName,
				files: [
					...(config.generateOnlyOverviewFile
						? []
						: config.entities.map<GeneratedFile>((entity) => {
								return getEntityFile(entity);
							})),
				],
			};
		},
	};
}
