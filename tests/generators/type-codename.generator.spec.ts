import type { ContentTypeModels, ContentTypeSnippetModels } from '@kontent-ai/management-sdk';
import { describe, expect, it } from 'vitest';
import { sharedTypesConfig } from '../../lib/config.js';
import { sortAlphabetically, uniqueFilter } from '../../lib/core/core.utils.js';
import { getElementCodenamesType } from '../../lib/generators/shared/type-codename.generator.js';

describe(`Element codenames generators`, () => {
    it(`Empty array should resolve to type 'never'`, () => {
        expect(getElementCodenamesType([], [])).toStrictEqual(`export type ${sharedTypesConfig.elementCodenames} = never`);
    });

    it(`Unique element codenames accross types & snippets`, () => {
        const typeElementCodenames: readonly string[] = ['a', 'b', 'c', 'a', 'b', 'c'];
        const snippetsElementCodenames: readonly string[] = ['d', 'f', 'c', 'a', 'g', 'a'];

        expect(
            getElementCodenamesType(
                [
                    {
                        elements: typeElementCodenames.map((codename) => ({ codename }))
                    }
                ] as Readonly<ContentTypeModels.ContentType>[],
                [
                    {
                        elements: snippetsElementCodenames.map((codename) => ({ codename }))
                    }
                ] as Readonly<ContentTypeSnippetModels.ContentTypeSnippet>[]
            )
        ).toStrictEqual(
            `export type ${sharedTypesConfig.elementCodenames} = ${sortAlphabetically(
                [...snippetsElementCodenames, ...typeElementCodenames],
                (m) => m
            )
                .filter(uniqueFilter)
                .map((codename) => `'${codename}'`)
                .join(' | ')};`
        );
    });
});
