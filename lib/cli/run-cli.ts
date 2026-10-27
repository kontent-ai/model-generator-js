import { logError } from "../core/error.utils.js";
import { argumentsFetcherAsync } from "./args/args-fetcher.js";
import type { CliArgumentsFetcher } from "./cli.models.js";

export async function runCliAsync(action: (cliFetcher: CliArgumentsFetcher) => Promise<void>): Promise<void> {
	try {
		await action(await argumentsFetcherAsync());
	} catch (error) {
		logError(error);
	}
}
