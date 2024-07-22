[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator.svg)](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator)
[![Build](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml)
[![GitHub license](https://img.shields.io/github/license/kontent-ai/model-generator-js.svg)](https://github.com/kontent-ai/model-generator-js)

# Kontent.ai Model Generator

The purpose of this project is to help you generate `Typescript models` based on [Kontent.ai](https://kontent.ai) item
types. These models can be used with the [Delivery SDK](https://www.npmjs.com/package/@kontent-ai/delivery-sdk) and
enhances your experience by providing strongly typed models.

## Installation

Install package globally so you can use it anywhere:

`npm i @kontent-ai/model-generator -g`

## Generate models with CLI

Go to folder where you want to create models and run:

`kontent-generate --environmentId=xxx --apiKey=yyy`

You may specify other options like:

`kontent-generate --environmentId=xxx --apiKey=yyy --addTimestamp=false --elementResolver=camelCase`

## Generate models in code

Apart from generating models via CLI, you may also generate models in code which also gives you some additional
configuration options (such as using custom name resolver).

```typescript
import { generateDeliveryModelsAsync } from '@kontent-ai/model-generator';

await generateDeliveryModelsAsync({
    sdkType: 'delivery',
    environmentId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9',
    isEnterpriseSubscription: true,
    apiKey: 'yyy',
    addTimestamp: true,
    moduleResolution: 'nodeNext',
    addEnvironmentInfo: true,
    elementResolver: 'camelCase',
    sortConfig: {
        sortTaxonomyTerms: true
    }
});
```

### Customizing generated file names

You may customize the way filenames are stored on file system using the `contentTypeFileResolver` and / or
`taxonomyTypeFileResolver` configuration option:

```typescript
await generateDeliveryModelsAsync({
    sdkType: 'delivery',
    environmentId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9',
    isEnterpriseSubscription: true,
    addEnvironmentInfo: true,
    apiKey: 'yyy',
    moduleResolution: 'nodeNext',
    addTimestamp: true,
    elementResolver: 'camelCase',
    contentTypeFileResolver: (type) => `content_type_${type.codename}`,
    taxonomyTypeFileResolver: (taxonomy) => `taxonomy_${taxonomy.codename}`
});
```

### Customizing generated content type names

You may customize name of content types using the `contentTypeResolver` configuration option and taxonomy types with the
`taxonomyTypeResolver` option:

```typescript
await generateDeliveryModelsAsync({
    sdkType: 'delivery',
    environmentId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9',
    isEnterpriseSubscription: true,
    apiKey: 'yyy',
    moduleResolution: 'nodeNext',
    addTimestamp: true,
    addEnvironmentInfo: true,
    elementResolver: 'camelCase',
    contentTypeResolver: (type) => `${textHelper.toPascalCase(type.codename)}Model`,
    taxonomyTypeResolver: (taxonomy) => `${textHelper.toPascalCase(taxonomy.codename)}Taxonomy`
});
```

## FAQ

-   If you are getting the `The Subscription API is not supported in your plan` error, set the
    `isEnterpriseSubscription` option to false

## CLI Configuration

-   `environmentId` - Id of the Kontent.ai environment
-   `apiKey`- Management API Key
-   `outputDir`- Directory where files will be created. Defaults to current directory - `--outputDir=./`. Some other
    examples: `--outputDir=./sample`
-   `isEnterpriseSubscription` - Indicates if enterprise subscription endpoint can be used to export data.
-   `addTimestamp`- Indicates if timestamp is added to generated models
-   `addEnvironmentInfo`- Indicates if environment info stamp is added to generated models
-   `elementResolver`- Name resolver for elements. Available options are: `camelCase`, `pascalCase`, `snakeCase`
-   `contentTypeFileResolver`- Name resolver for content type filenames. Available options are: `camelCase`,
    `pascalCase`, `snakeCase`
-   `contentTypeSnippetFileResolver`- Name resolver for content type snippet filenames. Available options are:
    `camelCase`, `pascalCase`, `snakeCase`
-   `taxonomyTypeFileResolver`- Name resolver for taxonomy filenames. Available options are: `camelCase`, `pascalCase`,
    `snakeCase`
-   `contentTypeResolver`- Name resolver for content type names. Available options are: `camelCase`, `pascalCase`,
    `snakeCase`
-   `contentTypeSnippetResolver`- Name resolver for content type snippet names. Available options are: `camelCase`,
    `pascalCase`, `snakeCase`
-   `taxonomyTypeResolver`- Name resolver for taxonomy type names. Available options are: `camelCase`, `pascalCase`,
    `snakeCase`
-   `sdkType`- Type of sdk for which models are generated. Available options are: `delivery`, `migration`
-   `exportWebhooks` - Indicates if webhooks are exported
-   `exportWorkflows` - Indicates if workflows are exported
-   `exportAssetFolders` - Indicates if asset folders are exported
-   `exportCollections` - Indicates if collections are exported
-   `exportLanguages` - Indicates if languages are exported
-   `exportRoles` - Indicates if roles are exported. \* Only available for Enterprise subscription plans
-   `managementApiUrl` - Sets the url of Management API.
-   `moduleResolution` - Module resolution for imports. Available options are: `node`, `nodeNext`

## Example models

Generator creates file for each content type in your project. For example:

`movie.ts`

```typescript
import { IContentItem, Elements } from '@kontent-ai/delivery-sdk';
import { Actor } from './actor';
import { ReleaseCategory } from '../taxonomies/releasecategory';

/**
 * Generated by '@kontent-ai/model-generator@5.0.0-3' at 'Thu, 14 Jul 2022 13:58:53 GMT'
 *
 * Movie
 * Id: b0c0f9c2-ffb6-4e62-bac9-34e14172dd8c
 * Codename: movie
 */
export type Movie = IContentItem<{
    /**
     * Title (text)
     * Required: true
     * Id: 3473187e-dc78-eff2-7099-f690f7042d4a
     * Codename: title
     */
    title: Elements.TextElement;

    /**
     * Plot (rich_text)
     * Required: false
     * Id: f7ee4f27-27fd-a19b-3c5c-102aae1c50ce
     * Codename: plot
     */
    plot: Elements.RichTextElement;

    /**
     * Released (date_time)
     * Required: false
     * Id: 5ccf4644-0d65-5d96-9a32-f4ea21974d51
     * Codename: released
     */
    released: Elements.DateTimeElement;

    /**
     * Length (number)
     * Required: false
     * Id: 7e8ecfab-a419-27ee-d8ec-8adb76fd007c
     * Codename: length
     */
    length: Elements.NumberElement;

    /**
     * Poster (asset)
     * Required: false
     * Id: a39a7237-9503-a1ae-8431-5b6cdb85ae9d
     * Codename: poster
     */
    poster: Elements.AssetsElement;

    /**
     * Category (multiple_choice)
     * Required: false
     * Id: 9821c252-6414-f549-c17f-cc171dd87713
     * Codename: category
     */
    category: Elements.MultipleChoiceElement;

    /**
     * Stars (modular_content)
     * Required: false
     * Id: aa26a55d-19f8-7501-fea3-b0d9b1eeac71
     * Codename: stars
     */
    stars: Elements.LinkedItemsElement<Actor | Movie>;

    /**
     * SeoName (url_slug)
     * Required: false
     * Id: 756cc91a-a090-60f9-a7f0-f505bfbe046c
     * Codename: seoname
     */
    seoname: Elements.UrlSlugElement;

    /**
     * ReleaseCategory (taxonomy)
     * Required: false
     * Id: 65f2fd44-1856-bc2b-17c2-decb0635e3d2
     * Codename: releasecategory
     */
    releasecategory: Elements.TaxonomyElement<ReleaseCategory>;
}>;
```

`movietype.ts`

```typescript
/**
 * Generated by '@kontent-ai/model-generator@5.0.0' at 'Mon, 28 Mar 2022 14:36:32 GMT'
 *
 * MovieType
 * Id: 365a17e6-1929-27ab-9f67-a9273c846717
 * Codename: movietype
 */
export type MovieType = 'student' | 'film' | 'tv' | 'blockbuster' | 'cinema_only';
```

To learn the complete generator output, see the following folder:
https://github.com/kontent-ai/model-generator-js/tree/master/sample

## Contribution & Feedback

Contributions are welcomed. Simply make a pull request.
