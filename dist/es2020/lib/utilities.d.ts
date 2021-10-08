import { CodeType, ModuleResolution } from './enums';
export declare class Utilities {
    getModuleResolution(moduleResolution: ModuleResolution): ModuleResolution;
    getCodeType(codeType: string): CodeType;
    capitalizeFirstLetter(text: string): string;
    toPascalCase(text: string): string;
}
export declare const utilities: Utilities;
