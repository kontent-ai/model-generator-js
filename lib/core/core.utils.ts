export function exitProgram(data: { readonly message: string }): never {
    throw Error(data.message);
}
