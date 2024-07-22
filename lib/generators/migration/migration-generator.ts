export interface MigrationGeneratorConfig {
    environmentId: string;
    apiKey: string;
}

export function migrationGenerator(config: MigrationGeneratorConfig) {
    console.log(config);
    return {
        generateModels(): string {
            return 'todo';
        }
    };
}
