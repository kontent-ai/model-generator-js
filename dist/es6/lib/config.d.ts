import { CodeType, ModuleResolution } from './enums';
export declare class GeneratorConfig {
    /**
    * Indicates if the first char after replacing underscore will be uppercase
    * e.g. field codename 'first_name' will be converted to 'firstName'
    */
    readonly uppercaseAfterUnderscoreReplacement: boolean;
    readonly propertyResolver = "propertyResolver";
    readonly codeOptions: CodeType[];
    readonly moduleOptions: ModuleResolution[];
    readonly itemBaseClass = "ContentItem";
    readonly elementsNamespace = "Elements";
    readonly CommonJsRequiredName = "KontentDelivery";
    readonly npmPackage = "@kentico/kontent-delivery";
    getNotice(type: 'ts' | 'js', addTimestamp: boolean): string;
    private getTimestamp;
    private getTypescriptTip;
}
export declare const generatorConfig: GeneratorConfig;
