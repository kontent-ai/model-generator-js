import type {
	CollectionModels,
	ContentTypeModels,
	ContentTypeSnippetModels,
	EnvironmentModels,
	LanguageModels,
	TaxonomyModels,
	WorkflowModels,
} from "@kontent-ai/management-sdk";
import { match } from "ts-pattern";
import { migrationConfig } from "../../config.js";
import { formatGuidelinesComment, wrapComment } from "../../core/comment.utils.js";
import type { FlattenedElement, GeneratedFile, GeneratedSet, ModuleFileExtension } from "../../core/core.models.js";
import { getFlattenedElements } from "../../core/element.utils.js";
import { getImporter } from "../../core/importer.js";
import { resolveCase } from "../../core/resolvers.js";
import { getTypeWithCodenames } from "../shared/type-codename.generator.js";

export interface MigrationGeneratorConfig {
	readonly moduleFileExtension: ModuleFileExtension;
	readonly disableComments: boolean;

	readonly environmentData: {
		readonly environment: Readonly<EnvironmentModels.EnvironmentInformationModel>;
		readonly types: readonly Readonly<ContentTypeModels.ContentType>[];
		readonly workflows: readonly Readonly<WorkflowModels.Workflow>[];
		readonly languages: readonly Readonly<LanguageModels.LanguageModel>[];
		readonly collections: readonly Readonly<CollectionModels.Collection>[];
		readonly snippets: readonly Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[];
		readonly taxonomies: readonly Readonly<TaxonomyModels.Taxonomy>[];
	};
}

export function getMigrationGenerator(config: MigrationGeneratorConfig) {
	const importer = getImporter(config.moduleFileExtension);

	const getMigrationItemType = (type: Readonly<ContentTypeModels.ContentType>): GeneratedFile => {
		const flattenedElements = getFlattenedElements({
			elements: type.elements,
			snippets: config.environmentData.snippets,
			taxonomies: config.environmentData.taxonomies,
			types: config.environmentData.types,
		});

		const importElementsType = !!flattenedElements.filter((m) => m.isElementWithProperty).length;

		return {
			filename: `${type.codename}.ts`,
			text: `
            ${
				importElementsType
					? importer.importType({
							filePathOrPackage: migrationConfig.npmPackageName,
							importValue: migrationConfig.sdkTypeNames.elementModels,
						})
					: ""
			}
             ${importer.importType({
					filePathOrPackage: `../${migrationConfig.migrationTypesFilename}.ts`,
					importValue: migrationConfig.localTypeNames.item,
				})}

            ${wrapComment(type.name, {
				disableComments: config.disableComments,
				lines: [
					{
						name: "Codename",
						value: type.codename,
					},
					{
						name: "Id",
						value: type.id,
					},
					{
						name: "External Id",
						value: type.externalId,
					},
				],
			})}
            export type ${resolveCase(type.name, "pascalCase")}Item = ${migrationConfig.localTypeNames.item}<
            '${type.codename}',
            ${getMigrationItemElementsCode(flattenedElements)}
            >;`,
		};
	};

	const getMigrationItemElementsCode = (flattenedElements: readonly FlattenedElement[]): string => {
		if (!flattenedElements.length) {
			return "Record<string, never>";
		}

		const elementsCode = flattenedElements
			.map((element, index) => {
				const isFirstElement = index === 0;
				return `\n${isFirstElement ? "" : "\n"}${wrapComment(element.title, {
					disableComments: config.disableComments,
					lines: [
						{
							name: "Codename",
							value: element.codename,
						},
						{
							name: "Id",
							value: element.id,
						},
						{
							name: "External Id",
							value: element.externalId,
						},
						{
							name: "Type",
							value: element.type,
						},
						{
							name: "Required",
							value: element.isRequired ? "true" : "false",
						},
						{
							name: "From snippet",
							value: element.fromSnippet ? element.fromSnippet.codename : undefined,
						},
						{
							name: "Taxonomy",
							value: element.assignedTaxonomy ? element.assignedTaxonomy.codename : undefined,
						},
						{
							name: "Allowed content types",
							value: element.allowedContentTypes ? element.allowedContentTypes.map((m) => m.codename).join(", ") : undefined,
						},
						{
							name: "Guidelines",
							value: element.guidelines ? formatGuidelinesComment(element.guidelines) : "",
						},
					],
				})}
                    readonly ${element.codename}: ${getElementPropType(element)}`;
			})
			.join(",\n");

		return `{${elementsCode}}`;
	};

	return {
		getEnvironmentFiles(): GeneratedSet {
			return {
				folderName: migrationConfig.environmentFolderName,
				files: [
					{
						filename: `${migrationConfig.environmentFilename}.ts`,
						text: `
                ${wrapComment("Type representing all languages", { disableComments: config.disableComments })}
                ${getLanguageCodenamesType(config.environmentData.languages)}

                ${wrapComment("Type representing all content types", { disableComments: config.disableComments })}
                ${getContentTypeCodenamesType(config.environmentData.types)}

                ${wrapComment("Type representing all collections", { disableComments: config.disableComments })}
                ${getCollectionCodenamesType(config.environmentData.collections)}

                ${wrapComment("Type representing all workflows", { disableComments: config.disableComments })}
                ${getWorkflowCodenamesType(config.environmentData.workflows)}

                ${wrapComment("Type representing all worksflow steps across all workflows", { disableComments: config.disableComments })}
                ${getWorkflowStepCodenamesType(config.environmentData.workflows)}
            `,
					},
				],
			};
		},
		getMigrationTypeFiles(): GeneratedSet {
			return {
				folderName: undefined,
				files: [
					{
						filename: `${migrationConfig.migrationTypesFilename}.ts`,
						text: `
                  ${importer.importType({
						filePathOrPackage: migrationConfig.npmPackageName,
						importValue: `${migrationConfig.sdkTypeNames.item}, ${migrationConfig.sdkTypeNames.system}, ${migrationConfig.sdkTypeNames.elements}`,
					})}
                   ${importer.importType({
						filePathOrPackage: `./${migrationConfig.environmentFolderName}/${migrationConfig.environmentFilename}.ts`,
						importValue: `${migrationConfig.collectionCodenames}, ${migrationConfig.contentTypeCodenames}, ${migrationConfig.languageCodenames}, ${migrationConfig.workflowCodenames}, ${migrationConfig.workflowStepCodenames}`,
					})}

                ${wrapComment("System object shared by all individual content type models", { disableComments: config.disableComments })}
                ${getSystemType()}

                ${wrapComment("Item object shared by all individual content type models", { disableComments: config.disableComments })}
                ${getItemType()}
            `,
					},
				],
			};
		},
		getMigrationItemFiles(): GeneratedSet {
			return {
				folderName: migrationConfig.migrationItemsFolderName,
				files: config.environmentData.types.map((type) => getMigrationItemType(type)),
			};
		},
	};
}

function getElementPropType(element: Readonly<FlattenedElement>): string {
	return match(element.type)
		.returnType<string>()
		.with("text", () => `${migrationConfig.sdkTypeNames.elementModels}.TextElement`)
		.with("asset", () => `${migrationConfig.sdkTypeNames.elementModels}.AssetElement`)
		.with("custom", () => `${migrationConfig.sdkTypeNames.elementModels}.CustomElement`)
		.with("date_time", () => `${migrationConfig.sdkTypeNames.elementModels}.DateTimeElement`)
		.with("rich_text", () => `${migrationConfig.sdkTypeNames.elementModels}.RichTextElement`)
		.with("number", () => `${migrationConfig.sdkTypeNames.elementModels}.NumberElement`)
		.with("multiple_choice", () => `${migrationConfig.sdkTypeNames.elementModels}.MultipleChoiceElement`)
		.with("subpages", () => `${migrationConfig.sdkTypeNames.elementModels}.SubpagesElement`)
		.with("taxonomy", () => `${migrationConfig.sdkTypeNames.elementModels}.TaxonomyElement`)
		.with("url_slug", () => `${migrationConfig.sdkTypeNames.elementModels}.UrlSlugElement`)
		.with("modular_content", () => `${migrationConfig.sdkTypeNames.elementModels}.LinkedItemsElement`)
		.with("guidelines", () => {
			throw new Error("Guidelines are not supported");
		})
		.with("snippet", () => {
			throw new Error("Snippets are not supported");
		})
		.exhaustive();
}

function getItemType(): string {
	return `export type ${migrationConfig.localTypeNames.item}<
        ${migrationConfig.localTypeNames.codename} extends ${migrationConfig.contentTypeCodenames},
        ${migrationConfig.localTypeNames.elements} extends ${migrationConfig.sdkTypeNames.elements} = ${migrationConfig.sdkTypeNames.elements},
    > = ${migrationConfig.sdkTypeNames.item}<${migrationConfig.localTypeNames.elements}, ${migrationConfig.localTypeNames.system}<${migrationConfig.localTypeNames.codename}>, ${migrationConfig.workflowStepCodenames}>;`;
}

function getSystemType(): string {
	return `export type ${migrationConfig.localTypeNames.system}<${migrationConfig.localTypeNames.codename} extends ${migrationConfig.contentTypeCodenames}> = ${migrationConfig.sdkTypeNames.system}<
    ${migrationConfig.localTypeNames.codename},
    ${migrationConfig.languageCodenames},
    ${migrationConfig.collectionCodenames},
    ${migrationConfig.workflowCodenames}
>;`;
}

function getLanguageCodenamesType(languages: readonly Readonly<LanguageModels.LanguageModel>[]): string {
	return getTypeWithCodenames(migrationConfig.languageCodenames, languages);
}

function getContentTypeCodenamesType(types: readonly Readonly<ContentTypeModels.ContentType>[]): string {
	return getTypeWithCodenames(migrationConfig.contentTypeCodenames, types);
}

function getWorkflowCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
	return getTypeWithCodenames(migrationConfig.workflowCodenames, workflows);
}

function getCollectionCodenamesType(collections: readonly Readonly<CollectionModels.Collection>[]): string {
	return getTypeWithCodenames(migrationConfig.collectionCodenames, collections);
}

export function getWorkflowStepCodenamesType(workflows: readonly Readonly<WorkflowModels.Workflow>[]): string {
	return getTypeWithCodenames(
		migrationConfig.workflowStepCodenames,
		workflows.flatMap((workflow) => [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep]),
	);
}
