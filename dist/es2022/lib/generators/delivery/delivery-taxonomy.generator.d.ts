import { TaxonomyTypeFileNameResolver, TaxonomyTypeResolver } from '../../models.js';
import { IGeneratedFile } from '../../common-helper.js';
import { TaxonomyModels } from '@kontent-ai/management-sdk';
export declare class DeliveryTaxonomyGenerator {
    generateTaxonomyTypesAsync(config: {
        outputDir: string;
        taxonomies: TaxonomyModels.Taxonomy[];
        taxonomyFolderName: string;
        addTimestamp: boolean;
        fileResolver?: TaxonomyTypeFileNameResolver;
        taxonomyResolver?: TaxonomyTypeResolver;
    }): Promise<IGeneratedFile[]>;
    private getTaxonomyComment;
    private generateModels;
    private getModelCode;
    private getTaxonomyTermsCode;
    private getTaxonomyTermCodenames;
}
export declare const deliveryTaxonomylGenerator: DeliveryTaxonomyGenerator;
