
export const collectionCodenames = ["default"] as const;

export type CollectionCodenames = (typeof collectionCodenames)[number];

export function isCollectionCodename(value: string | undefined | null): value is CollectionCodenames {
	return typeof value === "string" && (collectionCodenames as readonly string[]).includes(value);
}
