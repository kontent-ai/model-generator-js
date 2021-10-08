export declare class Generator {
    private readonly deliveryClient;
    readonly projectId: string;
    readonly secureAccessKey?: string;
    readonly addTimestamp: boolean;
    constructor(config: {
        projectId: string;
        addTimestamp: boolean;
        secureAccessKey?: string;
    });
    generateModelsAsync(): Promise<void>;
    private generateClass;
}
