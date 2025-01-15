import { ContentTypeElements, TaxonomyModels } from '@kontent-ai/management-sdk';
import { ModuleResolution } from './models.js';
export interface IGeneratedFile {
    filename: string;
    text: string;
}
export declare class CommonHelper {
    sortAlphabetically<T>(arrayToSort: T[], propertySelector: (item: T) => string): T[];
    getAutogenerateNote(addTimestamp: boolean): string;
    getElementCodename(element: ContentTypeElements.ContentTypeElementModel): string | undefined;
    isElementRequired(element: ContentTypeElements.ContentTypeElementModel): boolean;
    getElementGuidelines(element: ContentTypeElements.ContentTypeElementModel): string | null;
    getImportStatement(data: {
        filePath: string;
        importValue: string;
        moduleResolution: ModuleResolution;
        isExternalLib: boolean;
    }): string;
    getElementTitle(element: ContentTypeElements.ContentTypeElementModel, taxonomies: TaxonomyModels.Taxonomy[]): string | null;
    getBarrelExportCode(data: {
        filenames: string[];
        moduleResolution: ModuleResolution;
    }): string;
    escapeNameValue(value: string): string;
}
export declare const commonHelper: CommonHelper;
