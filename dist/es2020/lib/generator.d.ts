import { CodeType, ModuleResolution } from './enums';
export declare class Generator {
    private readonly deliveryClient;
    readonly projectId: string;
    readonly type: string;
    readonly moduleResolution: ModuleResolution;
    readonly codeType: CodeType;
    readonly secureAccessKey?: string;
    readonly strictPropertyInitalization: boolean;
    readonly addTimestamp: boolean;
    constructor(config: {
        projectId: string;
        type: string;
        moduleResolution: ModuleResolution;
        codeType: CodeType;
        strictPropertyInitalization: boolean;
        addTimestamp: boolean;
        secureAccessKey?: string;
    });
    startModelGenerator(): void;
    private generateClass;
}
