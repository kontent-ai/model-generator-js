export function exitProgram(data: { readonly message: string }): never {
    throw Error(data.message);
}

export function uniqueFilter(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
}

export function replaceTsExtensionWithJs(filePath: string): string {
    return filePath.replace('.ts', '.js');
}
