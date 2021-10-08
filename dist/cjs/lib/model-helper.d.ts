import { IContentType } from '@kentico/kontent-delivery';
export declare class ModelHelper {
    getFilename(data: {
        type: IContentType;
    }): string;
    getClassDefinition(data: {
        type: IContentType;
        addTimestamp: boolean;
    }): string;
    private getElementsCode;
    private mapElementTypeToName;
}
export declare const modelHelper: ModelHelper;
