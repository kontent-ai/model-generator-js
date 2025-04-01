import { environmentEntities, type EnvironmentEntity } from './core.models.js';

export function isEnvironmentEntity(value: string | undefined | null): value is EnvironmentEntity {
    return typeof value === 'string' && (environmentEntities as readonly string[]).includes(value);
}
