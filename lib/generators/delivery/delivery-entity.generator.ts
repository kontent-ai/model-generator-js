import type { CollectionModels, ContentTypeModels, LanguageModels } from '@kontent-ai/management-sdk';
import { TaxonomyModels, WorkflowModels } from '@kontent-ai/management-sdk';
import { match, P } from 'ts-pattern';
import { wrapComment } from '../../core/comment.utils.js';
import type { GeneratedFile, GeneratedSet, ModuleFileExtension } from '../../core/core.models.js';
import { getImporter } from '../../core/importer.js';
import type { FilenameResolver, MapObjectToName, NameResolver } from '../../core/resolvers.js';
import { mapFilename, mapName, resolveCase } from '../../core/resolvers.js';
import { getTypeWithCodenames } from '../shared/type-codename.generator.js';

export type DeliveryEntity =
    | Readonly<LanguageModels.LanguageModel>
    | Readonly<CollectionModels.Collection>
    | Readonly<WorkflowModels.Workflow>
    | Readonly<TaxonomyModels.Taxonomy>
    | Readonly<ContentTypeModels.ContentType>;

export type DeliveryEntityType = 'Language' | 'Collection' | 'Workflow' | 'Taxonomy' | 'ContentType';

export type DeliveryEntityGeneratorConfig<TEntity extends DeliveryEntity> = {
    readonly moduleFileExtension: ModuleFileExtension;
    readonly entityType: DeliveryEntityType;
    readonly entities: readonly Readonly<TEntity>[];
    readonly fileResolver: FilenameResolver<Readonly<TEntity>>;
    readonly nameResolver: NameResolver<Readonly<TEntity>>;
};

export type DeliveryEntityGenerator<TEntity extends DeliveryEntity> = {
    readonly entityName: DeliveryEntityType;
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
    const filenameMap = mapFilename(config.fileResolver);
    const nameMap = mapName(config.nameResolver, 'pascalCase', { suffix: `${config.entityType}Codename` });
    const valuesName = mapName('camelCase', 'camelCase', { suffix: 'Codenames' })({ name: `${config.entityType}` });
    const getEntityTypeGuardFunctionName = mapName(config.nameResolver, 'pascalCase', {
        prefix: 'is',
        suffix: `${config.entityType}Codename`
    });
    const entitiesTypeGuardFunctionName = mapName('pascalCase', 'pascalCase', {
        prefix: 'is'
    })({ name: `${config.entityType}Codename` });
    const coreEntityFilename = mapFilename('camelCase', {
        prefix: 'core.'
    })({ codename: `${config.entityType}` }, true);
    const entityCodenamesTypeName = `${config.entityType}Codenames`;

    const getPluralEntityName = (entityName: DeliveryEntityType): string => {
        return match(entityName)
            .returnType<string>()
            .with('Taxonomy', () => 'Taxonomies')
            .otherwise(() => `${entityName}s`);
    };

    const entityFolderName = `${resolveCase(getPluralEntityName(config.entityType), 'camelCase')}`;

    const getCodenames = (entities: readonly Readonly<TEntity>[]): readonly string[] => {
        return entities.map((m) => m.codename);
    };

    const getEntityTypeGuardFunction = (entity: Readonly<TEntity>): string => {
        return `export function ${getEntityTypeGuardFunctionName(entity)}(value: string | undefined | null): value is ${nameMap(entity)} {
                return typeof value === 'string' && value === ('${entity.codename}' satisfies ${nameMap(entity)});
            }`;
    };

    const getEntitiesTypeGuardFunction = (): string => {
        return `export function ${entitiesTypeGuardFunctionName}(value: string | undefined | null): value is ${entityCodenamesTypeName} {
    return typeof value === 'string' && (${valuesName} as readonly string[]).includes(value);
}`;
    };

    const getEntityInfoComment = (entity: Readonly<TEntity>): string => {
        return `* Codename: ${entity.codename}
 * Id: ${entity.id}`;
    };

    const getEntityValuesCode = (): string => {
        return `export const ${valuesName} = [${getCodenames(config.entities)
            .map((m) => `'${m}'`)
            .join(', ')}] as const;`;
    };

    const getCoreEntityCode = (): string => {
        return `
${wrapComment(`
 * Object containing all ${config.entityType} codenames
`)}
 ${getEntityValuesCode()}

 ${wrapComment(`
 * Type representing ${config.entityType} codenames
`)}
export type ${entityCodenamesTypeName} = typeof ${valuesName}[number];

 ${wrapComment(`
 * Type guard for ${config.entityType} codenames
`)}
${getEntitiesTypeGuardFunction()}
`;
    };

    const getEntityCode = (entity: Readonly<TEntity>): string => {
        return `
${importer.importType({
    filePathOrPackage: `./${coreEntityFilename}`,
    importValue: `${entityCodenamesTypeName}`
})}
    
 ${wrapComment(`
 * Type representing ${config.entityType} entities
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
${getEntitySpecificCode(entity, nameMap(entity))}
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
            filename: mapFilename('camelCase', {
                prefix: 'core.'
            })({ codename: config.entityType }, true),
            text: getCoreEntityCode()
        };
    };

    const getEntitySpecificCode = (entity: DeliveryEntity, resolvedName: string): string => {
        return match(entity)
            .returnType<string>()
            .with(P.instanceOf(WorkflowModels.Workflow), (workflow) => {
                return `
 ${wrapComment(`
 * Type representing workflow step codenames in ${workflow.name} workflow 
`)}
${getTypeWithCodenames(`${resolvedName}StepCodenames`, workflow.steps)};
`;
            })
            .with(P.instanceOf(TaxonomyModels.Taxonomy), (taxonomy) => {
                const termValuesPropertyName = mapName('camelCase', 'camelCase', {
                    suffix: `${config.entityType}TermCodenames`
                })({ name: taxonomy.name });
                const termsCodenamesTypeName = resolveCase(termValuesPropertyName, 'pascalCase');
                const termsTypeGuardFunctionName = mapName('pascalCase', 'pascalCase', {
                    prefix: 'is',
                    suffix: `${config.entityType}TermCodename`
                })({ name: taxonomy.name });

                const getTaxonomyTermGuardFunction = (): string => {
                    return `export function ${termsTypeGuardFunctionName}(value: string | undefined | null): value is ${termsCodenamesTypeName} {
                return typeof value === 'string' && (${termValuesPropertyName} as readonly string[]).includes(value);
            }`;
                };

                const getTaxonomyTermValuesCode = (): string => {
                    return `export const ${termValuesPropertyName} = [${getTaxonomyTermCodenames(taxonomy.terms)
                        .map((m) => `'${m}'`)
                        .join(', ')}] as const;`;
                };

                const getTaxonomyTermCodenames = (taxonomyTerms: readonly Readonly<TaxonomyModels.Taxonomy>[]): readonly string[] => {
                    return taxonomyTerms.reduce<readonly string[]>((codenames, taxonomyTerm) => {
                        return codenames.concat(getTaxonomyTermCodenames(taxonomyTerm.terms), taxonomyTerm.codename);
                    }, []);
                };

                return `
${wrapComment(`
 * Type representing taxonomy term codenames in ${taxonomy.name} taxonomy
`)}
${getTaxonomyTermValuesCode()};

${wrapComment(`
 * Type representing ${taxonomy.name} taxonomy terms
 * 
 * Codename: ${taxonomy.codename}
 * Id: ${taxonomy.id}
`)}
export type ${termsCodenamesTypeName} = typeof ${termValuesPropertyName}[number];

${wrapComment(`
 * Type guard for ${taxonomy.name} taxonomy term codenames
`)}
${getTaxonomyTermGuardFunction()};
`;
            })
            .otherwise(() => '');
    };

    return {
        entityName: config.entityType,
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
