import { parse } from 'path';
import { LibraryType, LiteralUnion, ModuleResolution } from './core.models.js';
import { getFileNameWithoutExtension, sortAlphabetically } from './core.utils.js';

export function importer(moduleResolution: ModuleResolution) {
    const getExtensionForModuleResolution = (moduleResolution: ModuleResolution): string => {
        return moduleResolution === 'nodeNext' ? '.js' : '';
    };

    return {
        importType: (data: { readonly filePathOrPackage: LiteralUnion<LibraryType>; readonly importValue: string }): string => {
            const isExternalLib = !data.filePathOrPackage.endsWith('.js') && !data.filePathOrPackage.endsWith('.ts');
            const resolvedFilePath =
                moduleResolution === 'nodeNext' && !isExternalLib
                    ? `${getFileNameWithoutExtension(data.filePathOrPackage)}.js`
                    : data.filePathOrPackage;

            return `import type { ${data.importValue} } from '${resolvedFilePath}';`;
        },
        getBarrelExportCode(filenames: readonly string[]): string {
            if (!filenames.length) {
                return 'export {}';
            }
            return sortAlphabetically(filenames, (filename) => filename).reduce<string>((barrelCode, filename) => {
                const path = parse(filename);
                return `${barrelCode} export * from '${path.dir}/${path.name}${getExtensionForModuleResolution(moduleResolution)}';`;
            }, '');
        }
    };
}
