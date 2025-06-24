import { createHash } from "node:crypto";
import { P, match } from "ts-pattern";
import type { CaseType, ObjectWithCodename, ObjectWithName } from "./core.models.js";

export type FilenameResolver<T extends Readonly<ObjectWithCodename>> = undefined | ((item: T, addExtension: boolean) => string);
export type NameResolver<T extends Readonly<ObjectWithName>> = undefined | ((item: T) => string);

export function mapFilename<T extends ObjectWithCodename>(
	resolver: NonNullable<FilenameResolver<T>>,
	options?: {
		readonly prefix?: string;
		readonly suffix?: string;
	},
): NonNullable<FilenameResolver<T>> {
	return (item, addExtension) => {
		return (
			(options?.prefix ? options.prefix : "") +
			addExtensionToFilename(
				resolveCase(
					match(resolver)
						.returnType<string>()
						.with(P.instanceOf(Function), (resolver) => resolver(item, addExtension))
						.otherwise(() => item.codename),
					"kebabCase",
				) + (options?.suffix ? options.suffix : ""),
				addExtension,
			)
		);
	};
}

export function mapName<T extends ObjectWithName>(
	resolver: NameResolver<T>,
	caseType: CaseType,
	options?: {
		readonly prefix?: string;
		readonly suffix?: string;
	},
): NonNullable<NameResolver<T>> {
	return (item) =>
		(options?.prefix ? options.prefix : "") +
		resolveCase(
			match(resolver)
				.returnType<string>()
				.with(P.instanceOf(Function), (resolver) => resolver(item))
				.otherwise(() => item.name),
			caseType,
		) +
		(options?.suffix ? options.suffix : "");
}

export function resolveCase(text: string, resolverType: CaseType): string {
	return match(resolverType)
		.returnType<string>()
		.with("camelCase", () => toCamelCase(text))
		.with("pascalCase", () => toPascalCase(text))
		.with("kebabCase", () => toKebabCase(text))
		.exhaustive();
}

export function resolvePropertyName(value: string): string {
	const propertyName = toCamelCase(value);

	if (propertyName.length === 0) {
		// to prevent empty string being used as property name, use hash
		return getPropertyStringHash(value);
	}

	return prefixWithUnderscoreWhenStartsWithNonAlpha(propertyName);
}

function addExtensionToFilename(filename: string, addExtension: boolean): string {
	return `${filename}${addExtension ? ".ts" : ""}`;
}

function toPascalCase(text: string): string {
	return prefixWithUnderscoreWhenStartsWithNonAlpha(
		toSafeStringCode(
			text
				.replace(/[_-]+/g, " ")
				.replace(/(?:^\w|[A-Z]|\b\w|\s+|\d\w)/g, (match) => match.toUpperCase())
				.replace(/\s+/g, ""),
			false,
		),
	);
}

function toKebabCase(text: string): string {
	const matchResult = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);

	if (!matchResult) {
		throw new Error(`Failed to convert text to kebab case: ${text}`);
	}

	return matchResult.join("-").toLowerCase();
}

function toCamelCase(text: string): string {
	return toPascalCase(text).replace(/^\w/, (s) => s.toLowerCase());
}

function getPropertyStringHash(text: string): string {
	const hash = createHash("sha256");
	hash.update(text);
	return `_${hash.digest("hex")}`.slice(0, 10);
}

function toSafeStringCode(text: string, allowHyphen: boolean): string {
	const replaceWith = "";
	const pattern = allowHyphen ? /[^a-zA-Z0-9_-]/g : /[^a-zA-Z0-9_]/g;

	return text.replace(pattern, replaceWith);
}

function prefixWithUnderscoreWhenStartsWithNonAlpha(text: string): string {
	if (/^[^a-zA-Z-]/.test(text)) {
		return `_${text.replace(/^_+/, "")}`;
	}
	return text;
}
