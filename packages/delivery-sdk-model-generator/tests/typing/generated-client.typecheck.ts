/**
 * Compile-time check that the generated sample models work with the delivery SDK. Checked by `pnpm run typecheck`, never executed.
 */
import { type ContentItemFilter, createDeliveryClient, isContentItemOfType } from "@kontent-ai/delivery-sdk";
import {
	type ActorItem,
	isMovieItem,
	type MovieItem,
	type TypedClientSchema,
	type TypedDeliveryClient,
	type TypedItem,
} from "../../sample/index.js";

const use = (..._values: readonly unknown[]): void => undefined;

const client: TypedDeliveryClient = createDeliveryClient<TypedClientSchema, TypedItem>({ apiMode: "public", environmentId: "x" });

export async function responses(): Promise<void> {
	const movies = await client.listContentItems({ contentTypes: ["movie"] }).fetchPage();
	const movieItems: readonly MovieItem[] = movies.payload.items;
	const stars: readonly (ActorItem | MovieItem)[] | undefined = movieItems[0]?.elements.stars.items;
	use(stars);

	const item = (await client.fetchContentItem({ codename: "warrior" }).fetch()).payload.item;
	if (isContentItemOfType(item, "actor")) {
		const firstName: string = item.elements.first_name.value;
		use(firstName);
	}
	if (isMovieItem(item)) {
		const releaseCategory: "global_release" | "local_release" | "us_only" | undefined =
			item.elements.releasecategory.value[0]?.codename;
		use(releaseCategory);
	}
}

export const filters: readonly ContentItemFilter<TypedClientSchema>[] = [
	{ property: "system.type", operator: "eq", value: "movie" },
	{ property: "system.workflow_step", operator: "neq", value: "archived" },
	{ property: "elements.category", operator: "any", value: ["action", "drama"] },
	{ property: "elements.releasecategory", operator: "contains", value: "us_only" },
	{ property: "elements.length", operator: "gte", value: 90 },
	// @ts-expect-error "moive" is not a content type codename.
	{ property: "system.type", operator: "eq", value: "moive" },
	// @ts-expect-error "tv" is a term of another taxonomy.
	{ property: "elements.releasecategory", operator: "contains", value: "tv" },
];
