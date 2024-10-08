import { defaultDeliveryApiMode, defaultModuleFileExtension } from '../config.js';
import { DeliveryApiMode, LiteralUnion, ModuleFileExtension } from '../core/core.models.js';

export function parseModuleFileExtension(moduleFileExtension: LiteralUnion<ModuleFileExtension> | undefined): ModuleFileExtension {
    return moduleFileExtensionOptions[moduleFileExtension ?? defaultModuleFileExtension];
}

export function parseDeliveryApiMode(apiMode: LiteralUnion<DeliveryApiMode> | undefined): DeliveryApiMode {
    return deliveryApiModeOptions[apiMode ?? defaultDeliveryApiMode];
}

export const moduleFileExtensionOptions: Record<LiteralUnion<ModuleFileExtension>, ModuleFileExtension> = {
    js: 'js',
    ts: 'ts',
    mts: 'mts',
    mjs: 'mjs',
    none: 'none'
};

export const deliveryApiModeOptions: Record<LiteralUnion<DeliveryApiMode>, DeliveryApiMode> = {
    default: 'default',
    preview: 'preview',
    secure: 'secure'
};
