
import type { ActorType } from "../types/actor-type.generated.js";
import type { MovieType } from "../types/movie-type.generated.js";

export const typeCodenames = ["actor", "movie"] as const;

export type TypeCodenames = (typeof typeCodenames)[number];

export function isTypeCodename(value: string | undefined | null): value is TypeCodenames {
	return typeof value === "string" && (typeCodenames as readonly string[]).includes(value);
}

export type CoreType = ActorType | MovieType;

export type CodenameTypeMapping = {
	readonly actor: ActorType;
	readonly movie: MovieType;
};

export type CodenameTypeMapper<TTypeCodename extends TypeCodenames> = TTypeCodename extends keyof CodenameTypeMapping
	? CodenameTypeMapping[TTypeCodename]
	: CoreType;
