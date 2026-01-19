
import type { Elements, IContentItem } from "@kontent-ai/delivery-sdk";
import type { CollectionCodenames } from "../system/collections.generated.js";
import type { LanguageCodenames } from "../system/languages.generated.js";
import type { CoreType, TypeCodenames } from "../system/types.generated.js";
import type { WorkflowCodenames, WorkflowStepCodenames } from "../system/workflows.generated.js";
import type {
	ReleaseCategoryTaxonomyCodename,
	ReleaseCategoryTaxonomyTermCodenames,
} from "../taxonomies/release-category-taxonomy.generated.js";
import type { ActorType } from "../types/actor-type.generated.js";

export type MovieTypeCodename = keyof Pick<Record<TypeCodenames, null>, "movie">;

export function isMovieTypeCodename(value: string | undefined | null): value is MovieTypeCodename {
	return typeof value === "string" && value === ("movie" satisfies MovieTypeCodename);
}

export type MovieType = IContentItem<
	{
		readonly title: Elements.TextElement;

		readonly plot: Elements.RichTextElement<CoreType>;

		readonly released: Elements.DateTimeElement;

		readonly length: Elements.NumberElement;

		readonly poster: Elements.AssetsElement;

		readonly category: Elements.MultipleChoiceElement<MovieTypeCategoryMultipleChoiceOptions>;

		readonly stars: Elements.LinkedItemsElement<ActorType | MovieType>;

		readonly seoname: Elements.UrlSlugElement;

		readonly releasecategory: Elements.TaxonomyElement<ReleaseCategoryTaxonomyTermCodenames, ReleaseCategoryTaxonomyCodename>;
	},
	MovieTypeCodename,
	LanguageCodenames,
	CollectionCodenames,
	WorkflowCodenames,
	WorkflowStepCodenames
>;

export type MovieTypeElementCodenames =
	| "title"
	| "plot"
	| "released"
	| "length"
	| "poster"
	| "category"
	| "stars"
	| "seoname"
	| "releasecategory";

export function isMovieType(item: IContentItem | undefined | null): item is MovieType {
	return item?.system.type === ("movie" satisfies MovieTypeCodename);
}

export type MovieTypeCategoryMultipleChoiceOptions =
	| "sci_fi"
	| "documentary"
	| "action"
	| "romance"
	| "animation"
	| "comedy"
	| "adventure"
	| "drama";
