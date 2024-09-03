import { LibraryType, LiteralUnion, ModuleResolution } from './core.models.js';
import { getFileNameWithoutExtension } from './core.utils.js';

export function importer(moduleResolution: ModuleResolution) {
    return {
        importType: (data: { readonly filePathOrPackage: LiteralUnion<LibraryType>; readonly importValue: string }): string => {
            const isExternalLib = !data.filePathOrPackage.endsWith('.js') && !data.filePathOrPackage.endsWith('.ts');
            const resolvedFilePath =
                moduleResolution === 'nodeNext' && !isExternalLib
                    ? `${getFileNameWithoutExtension(data.filePathOrPackage)}.js`
                    : data.filePathOrPackage;

            return `import type { ${data.importValue} } from '${resolvedFilePath}';`;
        }
    };
}
