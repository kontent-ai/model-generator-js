import { createDeliveryClient, type DeliveryClientConfig } from "@kontent-ai/delivery-sdk";
import chalk from "chalk";
import { match } from "ts-pattern";
import { coreConfig } from "../config.js";
import type { DeliveryApiMode, GeneratorContentItem, GeneratorDeliveryClient } from "../core/core.models.js";
import { sortAlphabetically } from "../core/core.utils.js";

export function getDeliveryKontentFetcher(config: {
	readonly environmentId: string;
	readonly deliveryApiKey: string | undefined;
	readonly baseUrl?: string;
	readonly apiMode: DeliveryApiMode;
}) {
	const client: GeneratorDeliveryClient = createDeliveryClient(getClientConfig());

	function getClientConfig(): DeliveryClientConfig {
		const baseConfig = {
			environmentId: config.environmentId,
			...(config.baseUrl ? { baseUrl: parseBaseUrl(config.baseUrl) } : {}),
		} as const;

		return match(config.apiMode)
			.returnType<DeliveryClientConfig>()
			.with("preview", () => ({ ...baseConfig, apiMode: "preview", deliveryApiKey: config.deliveryApiKey ?? "" }))
			.with("secure", () => ({ ...baseConfig, apiMode: "secure", deliveryApiKey: config.deliveryApiKey ?? "" }))
			.with("default", () => ({ ...baseConfig, apiMode: "public" }))
			.exhaustive();
	}

	return {
		async getItemsAsync(filterByTypeCodenames: readonly string[]): Promise<readonly Readonly<GeneratorContentItem>[]> {
			const pagedResponse = await client
				.itemsFeed({
					config: {
						customHeaders: [{ name: coreConfig.kontentTrackingHeaderName, value: coreConfig.kontentTrackingHeaderValue }],
					},
					...(filterByTypeCodenames.length > 0
						? { filters: [{ property: "system.type", operator: "in", value: [...filterByTypeCodenames] }] }
						: {}),
				})
				.fetchAllPages();

			const items = sortAlphabetically(
				pagedResponse.responses.flatMap((response) => response.payload.items),
				(item) => item.system.codename,
			);

			console.log(`Fetched '${chalk.yellow(items.length.toString())}' content items`);
			return items;
		},
	};
}

function parseBaseUrl(baseUrl: string): { readonly protocol: "https" | "http"; readonly host: string } {
	const url = new URL(baseUrl);
	return {
		protocol: url.protocol.replace(":", "") === "http" ? "http" : "https",
		host: url.host,
	};
}
