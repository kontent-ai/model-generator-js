
export const snippetCodenames = [] as const;

export type SnippetCodenames = (typeof snippetCodenames)[number];

export function isSnippetCodename(value: string | undefined | null): value is SnippetCodenames {
	return typeof value === "string" && (snippetCodenames as readonly string[]).includes(value);
}
