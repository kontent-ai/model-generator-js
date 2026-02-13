export const snippetCodenames = ["snippet_a", "empty_snippet"] as const;

export type SnippetCodenames = (typeof snippetCodenames)[number];

export function isSnippetCodename(value: string | undefined | null): value is SnippetCodenames {
	return typeof value === "string" && (snippetCodenames as readonly string[]).includes(value);
}
