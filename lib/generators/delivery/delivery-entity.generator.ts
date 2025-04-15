import type { CollectionModels, ContentTypeModels, LanguageModels } from '@kontent-ai/management-sdk';
import { TaxonomyModels, WorkflowModels } from '@kontent-ai/management-sdk';
import { match, P } from 'ts-pattern';
import { wrapComment } from '../../core/comment.utils.js';
import type { GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { isNotUndefined } from '../../core/core.utils.js';
import { getImporter } from '../../core/importer.js';
import type { FilenameResolver, MapObjectToName, NameResolver } from '../../core/resolvers.js';
import { mapFilename, mapName, resolveCase } from '../../core/resolvers.js';

export type DeliveryElement = {
    readonly codename: string;
    readonly name: string;
};

export type DeliveryEntity =
    | Readonly<LanguageModels.LanguageModel>
    | Readonly<CollectionModels.Collection>
    | Readonly<WorkflowModels.Workflow>
    | Readonly<TaxonomyModels.Taxonomy>
    | DeliveryElement
    | Readonly<ContentTypeModels.ContentType>;

export type DeliveryEntityType = 'Language' | 'Collection' | 'Workflow' | 'Taxonomy' | 'ContentType' | 'Element';

export type DeliveryEntityGeneratorConfig<TEntity extends DeliveryEntity> = {
    readonly moduleFileExtension: ModuleFileExtension;
    readonly entityType: DeliveryEntityType;
    readonly entities: readonly Readonly<TEntity>[];
    readonly fileResolver: FilenameResolver<Readonly<TEntity>>;
    readonly nameResolver: NameResolver<Readonly<TEntity>>;
};

export type DeliveryEntityGenerator<TEntity extends DeliveryEntity> = {
    readonly entityType: DeliveryEntityType;
    readonly coreEntityFilename: string;
    readonly entityFolderName: string;
    readonly entityCodenamesTypeName: string;
    readonly generateEntityTypes: () => GeneratedSet;
    readonly getEntityName: MapObjectToName<TEntity>;
};

export function getDeliveryEntityGenerator<TEntity extends DeliveryEntity>(
    config: DeliveryEntityGeneratorConfig<TEntity>
): DeliveryEntityGenerator<TEntity> {
    const importer = getImporter(config.moduleFileExtension);

    const getPluralEntityName = (entityName: DeliveryEntityType): string => {
        return match(entityName)
            .returnType<string>()
            .with('Taxonomy', () => 'Taxonomies')
            .otherwise(() => `${entityName}s`);
    };

    const filenameMap = mapFilename(config.fileResolver, {
        suffix: `.${resolveCase(config.entityType, 'camelCase')}`
    });
    const nameMapWithoutSuffix = mapName(config.nameResolver, 'pascalCase', { suffix: `${config.entityType}` });
    const nameMap = mapName(config.nameResolver, 'pascalCase', { suffix: `${config.entityType}Codename` });
    const getEntityTypeGuardFunctionName = mapName(config.nameResolver, 'pascalCase', {
        prefix: 'is',
        suffix: `${config.entityType}Codename`
    });

    const coreEntityFilename = mapFilename('camelCase', {
        prefix: '_'
    })({ codename: `${getPluralEntityName(config.entityType)}` }, true);
    const entityCodenamesTypeName = `${config.entityType}Codenames`;

    const entityFolderName = `${resolveCase(getPluralEntityName(config.entityType), 'camelCase')}`;

    const getEntityTypeGuardFunction = (entity: Readonly<TEntity>): string => {
        return `export function ${getEntityTypeGuardFunctionName(entity)}(value: string | undefined | null): value is ${nameMap(entity)} {
                return typeof value === 'string' && value === ('${entity.codename}' satisfies ${nameMap(entity)});
            }`;
    };

    const getEntityInfoComment = (entity: Readonly<TEntity>): string => {
        return `* Codename: ${entity.codename}`;
    };

    const getCoreEntityCode = (): string => {
        return `
${getCodeForSpecificEntity({
    codenames: config.entities.map((m) => m.codename),
    originalName: undefined,
    resolvedName: config.entityType,
    type: config.entityType,
    propertySuffix: 'Codenames',
    typeGuardSuffix: 'Codename'
})}
${getCoreEntitySpecificCode()}
`;
    };

    const getEntityCode = (entity: Readonly<TEntity>): string => {
        return `
${importer.importType({
    filePathOrPackage: `./${coreEntityFilename}`,
    importValue: `${entityCodenamesTypeName}`
})}
    
 ${wrapComment(`
 * Type representing codename of ${entity.name} ${config.entityType}
 * 
${getEntityInfoComment(entity)}
`)}
export type ${nameMap(entity)} = Extract<${entityCodenamesTypeName}, '${entity.codename}'>;

${wrapComment(`
 * Type guard for ${entity.name} entity
 * 
${getEntityInfoComment(entity)}
`)}
${getEntityTypeGuardFunction(entity)}
${getEntitySpecificCode(entity, nameMapWithoutSuffix(entity))}
`;
    };

    const getEntityFile = (entity: Readonly<TEntity>): GeneratedFile => {
        return {
            filename: filenameMap(entity, true),
            text: getEntityCode(entity)
        };
    };

    const generateCoreEntityFile = (): GeneratedFile => {
        return {
            filename: coreEntityFilename,
            text: getCoreEntityCode()
        };
    };

    const getCoreEntitySpecificCode = (): string => {
        return match(config.entityType)
            .returnType<string>()
            .with('Workflow', () => {
                const workflowSteps: readonly string[] = config.entities
                    .filter((m) => m instanceof WorkflowModels.Workflow)
                    .flatMap((workflow) =>
                        [...workflow.steps, workflow.publishedStep, workflow.archivedStep, workflow.scheduledStep].filter(isNotUndefined)
                    )
                    .map((m) => m.codename);

                return getCodeForSpecificEntity({
                    codenames: workflowSteps,
                    originalName: 'Workflow',
                    resolvedName: 'Workflow',
                    type: 'workflow step',
                    propertySuffix: 'StepCodenames',
                    typeGuardSuffix: 'StepCodename'
                });
            })
            .otherwise(() => '');
    };

    const getEntitySpecificCode = (entity: DeliveryEntity, resolvedName: string): string => {
        return match(entity)
            .returnType<string>()
            .with(P.instanceOf(WorkflowModels.Workflow), (workflow) => {
                return getCodeForSpecificEntity({
                    codenames: [
                        ...workflow.steps.map((m) => m.codename),
                        workflow.publishedStep?.codename,
                        workflow.archivedStep?.codename,
                        workflow.scheduledStep?.codename
                    ].filter(isNotUndefined),
                    originalName: workflow.name,
                    resolvedName: resolvedName,
                    type: 'workflow step',
                    propertySuffix: 'StepCodenames',
                    typeGuardSuffix: 'StepCodename'
                });
            })
            .with(P.instanceOf(TaxonomyModels.Taxonomy), (taxonomy) => {
                return getCodeForSpecificEntity({
                    codenames: getTaxonomyTermCodenames(taxonomy.terms),
                    originalName: taxonomy.name,
                    resolvedName: resolvedName,
                    type: 'taxonomy term',
                    propertySuffix: 'TermCodenames',
                    typeGuardSuffix: 'TermCodename'
                });
            })
            .otherwise(() => '');
    };

    const getCodeForSpecificEntity = ({
        originalName,
        resolvedName,
        type,
        propertySuffix,
        typeGuardSuffix,
        codenames
    }: {
        readonly resolvedName: string;
        readonly originalName: string | undefined;
        readonly type: 'taxonomy term' | 'workflow step' | DeliveryEntityType;
        readonly codenames: readonly string[];
        readonly propertySuffix: string;
        readonly typeGuardSuffix: string;
    }): string => {
        const valuesPropertyName = mapName('camelCase', 'camelCase', {
            suffix: `${propertySuffix}`
        })({ name: resolvedName });
        const codenamesTypeName = resolveCase(valuesPropertyName, 'pascalCase');
        const typeGuardFunctionName = mapName('pascalCase', 'pascalCase', {
            prefix: 'is',
            suffix: `${typeGuardSuffix}`
        })({ name: resolvedName });

        const getTypeGuardFunction = (): string => {
            return `export function ${typeGuardFunctionName}(value: string | undefined | null): value is ${codenamesTypeName} {
                return typeof value === 'string' && (${valuesPropertyName} as readonly string[]).includes(value);
            }`;
        };

        const getValuesCode = (): string => {
            return `export const ${valuesPropertyName} = [${codenames.map((m) => `'${m}'`).join(', ')}] as const;`;
        };

        return `
${wrapComment(`
 * Object with all values of ${type} codenames ${originalName ? `in ${originalName}` : ''}
`)}
${getValuesCode()};

${wrapComment(`
 * Type representing ${type} codenames ${originalName ? `in ${originalName}` : ''}
`)}
export type ${codenamesTypeName} = typeof ${valuesPropertyName}[number];

${wrapComment(`
 * Type guard for ${type} codenames ${originalName ? `in ${originalName}` : ''}
`)}
${getTypeGuardFunction()};
`;
    };

    const getTaxonomyTermCodenames = (taxonomyTerms: readonly Readonly<TaxonomyModels.Taxonomy>[]): readonly string[] => {
        return taxonomyTerms.reduce<readonly string[]>((codenames, taxonomyTerm) => {
            return codenames.concat(getTaxonomyTermCodenames(taxonomyTerm.terms), taxonomyTerm.codename);
        }, []);
    };

    return {
        entityType: config.entityType,
        coreEntityFilename,
        entityFolderName,
        entityCodenamesTypeName: entityCodenamesTypeName,
        getEntityName: nameMap,
        generateEntityTypes: (): GeneratedSet => {
            return {
                folderName: entityFolderName,
                files: [
                    ...config.entities.map<GeneratedFile>((entity) => {
                        return getEntityFile(entity);
                    }),
                    generateCoreEntityFile()
                ]
            };
        }
    };
}
