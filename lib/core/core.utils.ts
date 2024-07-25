import { ModuleResolution } from '../models.js';
import { LibraryType, LiteralUnion } from './index.js';

export function exitProgram(data: { readonly message: string }): never {
    throw Error(data.message);
}

export function uniqueFilter(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
}

export function replaceTsExtensionWithJs(filePath: string): string {
    return filePath.replace('.ts', '.js');
}

export function getFileNameWithoutExtension(filePath: string): string {
    const lastDotIndex = filePath.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return filePath;
    }
    return filePath.substring(0, lastDotIndex);
}

export function getImportStatement(data: {
    filePathOrPackage: LiteralUnion<LibraryType>;
    importValue: string;
    moduleResolution: ModuleResolution;
}): string {
    const isExternalLib = !data.filePathOrPackage.endsWith('.js') && !data.filePathOrPackage.endsWith('.ts');
    const resolvedFilePath =
        data.moduleResolution === 'nodeNext' && !isExternalLib
            ? `${getFileNameWithoutExtension(data.filePathOrPackage)}.js`
            : data.filePathOrPackage;

    return `import type { ${data.importValue} } from '${resolvedFilePath}';`;
}
