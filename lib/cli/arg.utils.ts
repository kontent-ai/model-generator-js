import { defaultDeliveryApiMode, defaultModuleFileExtension } from '../config.js';
import { DeliveryApiMode, LiteralUnion, ModuleFileExtension } from '../core/core.models.js';

export function parseModuleFileExtension(moduleFileExtension: LiteralUnion<ModuleFileExtension> | undefined): ModuleFileExtension {
    if (moduleFileExtension === 'js') {
        return 'js';
    }

    if (moduleFileExtension === 'ts') {
        return 'ts';
    }

    if (moduleFileExtension === 'none') {
        return 'none';
    }

    return defaultModuleFileExtension;
}

export function parseDeliveryApiMode(apiMode: LiteralUnion<DeliveryApiMode> | undefined): DeliveryApiMode {
    if (apiMode === 'default') {
        return 'default';
    }

    if (apiMode === 'preview') {
        return 'preview';
    }

    if (apiMode === 'secure') {
        return 'secure';
    }

    return defaultDeliveryApiMode;
}
