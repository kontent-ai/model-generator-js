import { defaultModuleFileExtension } from '../config.js';
import { LiteralUnion, ModuleFileExtension } from '../core/core.models.js';

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
