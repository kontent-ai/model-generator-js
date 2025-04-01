import { HttpService } from '@kontent-ai/core-sdk';
import type { ClientTypes, IContentItem, ItemsFeedQuery } from '@kontent-ai/delivery-sdk';
import { createDeliveryClient } from '@kontent-ai/delivery-sdk';
import chalk from 'chalk';
import { coreConfig } from '../config.js';
import type { DeliveryApiMode, GeneratorDeliveryClient } from '../core/core.models.js';
import { sortAlphabetically } from '../core/core.utils.js';

export function getDeliveryKontentFetcher(config: {
    readonly environmentId: string;
    readonly deliveryApiKey: string | undefined;
    readonly baseUrl?: string;
    readonly apiMode: DeliveryApiMode;
}) {
    const client: GeneratorDeliveryClient = createDeliveryClient({
        environmentId: config.environmentId,
        defaultQueryConfig: {
            usePreviewMode: config.apiMode === 'preview',
            useSecuredMode: config.apiMode === 'secure',
            customHeaders: [
                {
                    header: coreConfig.kontentTrackingHeaderName,
                    value: coreConfig.kontentTrackingHeaderValue
                }
            ]
        },
        secureApiKey: config.apiMode === 'secure' ? config.deliveryApiKey : undefined,
        previewApiKey: config.apiMode === 'preview' ? config.deliveryApiKey : undefined,
        proxy: {
            baseUrl: config.baseUrl
        },
        httpService: new HttpService({ logErrorsToConsole: false })
    });

    const getItemsQuery = (filterByTypeCodenames: readonly string[]): ItemsFeedQuery<ClientTypes> => {
        return filterByTypeCodenames.length > 0 ? client.itemsFeed().types(filterByTypeCodenames.map((m) => m)) : client.itemsFeed();
    };

    return {
        async getItemsAsync(filterByTypeCodenames: readonly string[]): Promise<readonly Readonly<IContentItem>[]> {
            const items = sortAlphabetically(
                (await getItemsQuery(filterByTypeCodenames).toAllPromise()).data.items,
                (m) => m.system.codename
            );
            console.log(`Fetched '${chalk.yellow(items.length.toString())}' content items`);
            return items;
        }
    };
}
