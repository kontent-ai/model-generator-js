import { ContentType } from '@kentico/kontent-delivery';
import { CodeType, ModuleResolution } from './enums';
export declare class ModelHelper {
    getFullClassFileName(opts: {
        type: ContentType;
        codeType: CodeType;
    }): string;
    getClassDefinition(opts: {
        type: ContentType;
        moduleResolution: ModuleResolution;
        codeType: CodeType;
        strictPropertyInitalization: boolean;
        addTimestamp: boolean;
    }): string;
    private getExportClass;
    private getImports;
    private getContentTypeElements;
    private getModuleResolution;
    private getStrictInitialization;
    private getConstructor;
    private propertyRequiresCapitalization;
    private getPropertyName;
    private getClassName;
    private getClassFilename;
    private mapElementTypeToName;
}
export declare const modelHelper: ModelHelper;
