
import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";

export type ActorTypeCodename = keyof Pick<Record<TypeCodenames, null>, "actor">;

export function isActorTypeCodename(value: string | undefined | null): value is ActorTypeCodename {
	return typeof value === "string" && value === ("actor" satisfies ActorTypeCodename);
}

export type ActorType = IContentItem<
	{
		readonly url: Elements.UrlSlugElement;

		readonly first_name: Elements.TextElement;

		readonly last_name: Elements.TextElement;

		readonly photo: Elements.AssetsElement;
	},
	ActorTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type ActorTypeElementCodenames = "url" | "first_name" | "last_name" | "photo";

export function isActorType(item: IContentItem | undefined | null): item is ActorType {
	return item?.system.type === ("actor" satisfies ActorTypeCodename);
}
