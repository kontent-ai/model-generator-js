[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator.svg)](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator)
[![Build](https://github.com/kontent-ai/model-generator-js/actions/workflows/build.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/build.yml)
[![Integration Tests](https://github.com/kontent-ai/model-generator-js/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/integration-tests.yml)
[![Unit Tests](https://github.com/kontent-ai/model-generator-js/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/unit-tests.yml)
[![GitHub license](https://img.shields.io/github/license/kontent-ai/model-generator-js.svg)](https://github.com/kontent-ai/model-generator-js)

# Kontent.ai Model Generator

The Kontent.ai Model Generator is a developer tool that streamlines working with Kontent.ai by generating strongly typed objects and TypeScript models. It supports the generation of five distinct model types, each tailored to specific use cases:

| Model type                                     | Description                                                                                                                                                                                                                                                    | Compatibility                                                      |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [delivery-sdk](#delivery-sdk-models)           | Generates TypeScript models for the [JS Delivery SDK](https://www.npmjs.com/package/@kontent-ai/delivery-sdk). These models include content types, taxonomies, and codename-based types representing elements such as workflow steps, languages, and more.     | `@kontent-ai/delivery-sdk` version `16.0.0` or higher              |
| [migration-toolkit](#migration-toolkit-models) | Creates TypeScript models for the [Migration Toolkit](https://www.npmjs.com/package/@kontent-ai/migration-toolkit). These models help simplify and standardize the process of writing migration scripts.                                                       | `@kontent-ai/migration-toolkit` version `2.6.0` or higher          |
| [sync-sdk](#sync-sdk-models)                   | Generates TypeScript models for the [Sync SDK](https://www.npmjs.com/package/@kontent-ai/sync-sdk). These models provide type-safe access to environment metadata including languages, content types, workflows, collections, and taxonomies.                  | `@kontent-ai/sync-sdk` version `1.0.0` or higher                   |
| [environment](#environment-models)             | Generates JavaScript objects (not TypeScript types) representing the entire structure of your environment — including content types, workflows, languages, and taxonomies. These objects provide comprehensive access to environment metadata.                 | Can be used in any project. No external dependencies are required. |
| [items](#item-models)                          | Produces TypeScript types for all item codenames, along with objects containing the id and codename of each item. This is particularly useful when referencing a set of items in your code, enabling type-safe access instead of relying on hardcoded strings. | Can be used in any project. No external dependencies are required. |

## Installation

You can install the generator globally, add it as a development dependency, or simply run it using npx for convenience.

```bash
# Install globally
npm i @kontent-ai/model-generator@latest -g

# Install as dev dependency and use in your code
npm i @kontent-ai/model-generator@latest --save-dev 

# Run with npx
npx @kontent-ai/model-generator@latest --help
```

### CLI Help

```bash
# General help
npx @kontent-ai/model-generator@latest  --help

# Or get help for specific command
npx @kontent-ai/model-generator@latest delivery-sdk --help
```

## Delivery SDK Models

> [!TIP]
> Recommended: Using these models is highly encouraged when working with the JavaScript Delivery SDK, as they provide robust type
> safety and streamline development.

Basic usage

```bash
npx @kontent-ai/model-generator@latest delivery-sdk
    --environmentId=<id>
    --managementApiKey=<key>
```

Usage with options

```bash
npx @kontent-ai/model-generator@latest delivery-sdk
    --environmentId=<id>
    --managementApiKey=<key>
    --outputDir=<path>
    --moduleFileExtension=<js | ts | none | mts | mjs>
    --addTimestamp=<true, false>
    --managementBaseUrl=<proxyUrl>
```

```typescript
import { generateDeliveryModelsAsync } from '@kontent-ai/model-generator';

await generateDeliveryModelsAsync({
    // required
    environmentId: 'x',
    managementApiKey: 'y',
    moduleFileExtension: 'js',
    addTimestamp: false,
    createFiles: true,
    outputDir: '/', // only required when createFiles is true

    // optional
    fileResolvers: { contentType: (type) => `Custom_${type.codename}`, snippet: (snippet) => `Custom_${snippet.codename}`, taxonomy: (taxonomy) => `Custom_${taxonomy.codename}` },
    nameResolvers: { contentType: (type) => `Custom_${type.codename}`, snippet:(snippet) => `Custom_${snippet.codename}`, taxonomy: (taxonomy) => `Custom_${taxonomy.codename}` },
    formatOptions: { indentSize: 4, quote: 'single' },
    baseUrl: undefined
});
```

Configuration

| Option                | Description                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `environmentId`       | Id of Kontent.ai environment                                                                                                   |
| `managementApiKey`    | Management API key                                                                                                             |
| `moduleFileExtension` | Extension used for imports in generated models.                                                                                |
| `addTimestamp`        | Indicates if models contain timestamp                                                                                          |
| `createFiles`         | If enabled, files will be created on FileSystem. When disabled you may iterate over the result and process the files yourself. |
| `outputDir`           | Output directory path for files. Only available when `createFiles` is set to `true`                                            |
| `fileResolvers`       | Can be used to customize the generated filenames                                                                               |
| `nameResolvers`       | Can be used to customize names of generated types                                                                              |
| `formatOptions`       | Prettier configuration for formatting generated code                                                                           |
| `baseUrl`             | Can be used to override default Kontent.ai URLs                                                                                |

## Migration toolkit models

Basic usage

```bash
npx @kontent-ai/model-generator@latest migration-toolkit
    --environmentId=<id>
    --managementApiKey=<key>
```

Usage with options

```bash
npx @kontent-ai/model-generator@latest migration-toolkit
    --environmentId=<id>
    --managementApiKey=<key>
    --outputDir=<path>
    --moduleFileExtension=<js | ts | none | mts | mjs>
    --addTimestamp=<true, false>
    --managementBaseUrl=<proxyUrl>
```

```typescript
import { generateMigrationModelsAsync } from '@kontent-ai/model-generator';

await generateMigrationModelsAsync({
    // required
    environmentId: 'x',
    managementApiKey: 'y',
    moduleFileExtension: 'js',
    addTimestamp: false,
    createFiles: true,
    outputDir: '/', // only required when createFiles is true

    // optional
    baseUrl: undefined,
    formatOptions: { indentSize: 4, quote: 'single' }
});
```

Configuration

| Option                | Description                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `environmentId`       | Id of Kontent.ai environment                                                                                                   |
| `managementApiKey`    | Management API key                                                                                                             |
| `moduleFileExtension` | Extension used for imports in generated models.                                                                                |
| `addTimestamp`        | Indicates if models contain timestamp                                                                                          |
| `createFiles`         | If enabled, files will be created on FileSystem. When disabled you may iterate over the result and process the files yourself. |
| `outputDir`           | Output directory path for files. Only available when `createFiles` is set to `true`                                            |
| `formatOptions`       | Prettier configuration for formatting generated code                                                                           |
| `baseUrl`             | Can be used to override default Kontent.ai URLs                                                                                |

## Sync SDK models

> [!TIP]
> Recommended: Using these models is highly encouraged when working with the Sync SDK, as they provide robust type
> safety and streamline development.

Basic usage

```bash
npx @kontent-ai/model-generator@latest sync-sdk
    --environmentId=<id>
    --managementApiKey=<key>
```

Usage with options

```bash
npx @kontent-ai/model-generator@latest sync-sdk
    --environmentId=<id>
    --managementApiKey=<key>
    --outputDir=<path>
    --moduleFileExtension=<js | ts | none | mts | mjs>
    --addTimestamp=<true, false>
    --managementBaseUrl=<proxyUrl>
```

```typescript
import { generateSyncModelsAsync } from '@kontent-ai/model-generator';

await generateSyncModelsAsync({
    // required
    environmentId: 'x',
    managementApiKey: 'y',
    moduleFileExtension: 'js',
    addTimestamp: false,
    createFiles: true,
    outputDir: '/', // only required when createFiles is true

    // optional
    baseUrl: undefined,
    formatOptions: { indentSize: 4, quote: 'single' }
});
```

Configuration

| Option                | Description                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `environmentId`       | Id of Kontent.ai environment                                                                                                   |
| `managementApiKey`    | Management API key                                                                                                             |
| `moduleFileExtension` | Extension used for imports in generated models.                                                                                |
| `addTimestamp`        | Indicates if models contain timestamp                                                                                          |
| `createFiles`         | If enabled, files will be created on FileSystem. When disabled you may iterate over the result and process the files yourself. |
| `outputDir`           | Output directory path for files. Only available when `createFiles` is set to `true`                                            |
| `formatOptions`       | Prettier configuration for formatting generated code                                                                           |
| `baseUrl`             | Can be used to override default Kontent.ai URLs                                                                                |

## Environment models

> [!WARNING]
> Due to their potentially large size, these objects are intended for use in backend/server-side code only. Avoid including them in
> client-side applications to prevent unnecessary bundle size and exposure of sensitive data.

Basic usage

```bash
npx @kontent-ai/model-generator@latest environment
    --environmentId=<id>
    --managementApiKey=<key>
```

Usage with options

```bash
npx @kontent-ai/model-generator@latest environment
    --environmentId=<id>
    --managementApiKey=<key>
    --entities=<contentTypes,taxonomies,languages>
    --outputDir=<path>
    --moduleFileExtension=<js | ts | none | mts | mjs>
    --addTimestamp=<true, false>
    --managementBaseUrl=<proxyUrl>
```

Available entities

```typescript
[
    'languages',
    'taxonomies',
    'contentTypes',
    'snippets',
    'webhooks',
    'collections',
    'workflows',
    'assetFolders',
    'roles',
    'customApps',
    'previewUrls',
    'spaces'
];
```

```typescript
import { generateEnvironmentModelsAsync } from '@kontent-ai/model-generator';

await generateEnvironmentModelsAsync({
    // required
    environmentId: 'x',
    managementApiKey: 'y',
    entities: [], // all entity types are exported by default
    addTimestamp: false,
    moduleFileExtension: 'js',
    createFiles: true,
    outputDir: '/', // only required when createFiles is true
    // optional
    baseUrl: undefined,
    formatOptions: { indentSize: 4, quote: 'single' }
});
```

Configuration

| Option                | Description                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `environmentId`       | Id of Kontent.ai environment                                                                                                   |
| `managementApiKey`    | Management API key                                                                                                             |
| `entities`            | Array of entity types that will be exported                                                                                    |
| `moduleFileExtension` | Extension used for imports in generated models.                                                                                |
| `addTimestamp`        | Indicates if models contain timestamp                                                                                          |
| `createFiles`         | If enabled, files will be created on FileSystem. When disabled you may iterate over the result and process the files yourself. |
| `outputDir`           | Output directory path for files. Only available when `createFiles` is set to `true`                                            |
| `formatOptions`       | Prettier configuration for formatting generated code                                                                           |
| `baseUrl`             | Can be used to override default Kontent.ai URLs                                                                                |

## Item models

> [!TIP]
> This option is not recommended for environments with a large volume of content items, as it may lead to performance or scalability
> issues during code generation.

Basic usage

```bash
# 'deliveryApiKey' option is required for 'preview' or 'secure' api modes
# 'contentTypes' option is CSV of content type codenames and can be used to narrow down generated items
npx @kontent-ai/model-generator@latest items
    --environmentId=<id>
    --managementApiKey=<key>
```

Usage with options

```bash
npx @kontent-ai/model-generator@latest items
    --environmentId=<id>
    --managementApiKey=<key>
     -deliveryApiKey=<key>
    --apiMode=<default, preview, secure>
    --generateTypes=<true, false>
    --generateObjects=<true, false>
    --outputDir=<path>
    --moduleFileExtension=<js | ts | none | mts | mjs>
    --addTimestamp=<true, false>
    --filterByTypeCodenames=<codenameA,codenameB>
    --managementBaseUrl=<proxyUrl>
    --deliveryBaseUrl=<proxyUrl>
```

```typescript
import { generateItemsAsync } from '@kontent-ai/model-generator';

await generateItemsAsync({
    // required
    environmentId: 'x',
    managementApiKey: 'y',
    deliveryApiKey: 'z', // only required when secure / api mode is used
    addTimestamp: false,
    moduleFileExtension: 'js',
    apiMode: 'default',
    filterByTypeCodenames: [],
    generateObjects: true,
    generateTypes: true,
    createFiles: true,
    outputDir: '/', // only required when createFiles is true
    // optional
    baseUrl: undefined,
    formatOptions: { indentSize: 4, quote: 'single' },
    deliveryBaseUrl: undefined
});
```

Configuration

| Option                  | Description                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `environmentId`         | Id of Kontent.ai environment                                                                                                   |
| `managementApiKey`      | Management API key                                                                                                             |
| `deliveryApiKey`        | Delivery API key required when the `apiMode` is using preview or secure mode                                                   |
| `moduleFileExtension`   | Extension used for imports in generated models.                                                                                |
| `addTimestamp`          | Indicates if models contain timestamp                                                                                          |
| `generateObjects`       | If enabled, javascript objects with codename / id will be generated                                                            |
| `generateTypes`         | If enabled, typescript type representing codename will be generated                                                            |
| `filterByTypeCodenames` | Array of content type codenames of which content items will be generated. Useful for narrowing down generated items            |
| `apiMode`               | Delivery API mode for fetching content items. By default delivery (public) mode is used                                        |
| `createFiles`           | If enabled, files will be created on FileSystem. When disabled you may iterate over the result and process the files yourself. |
| `outputDir`             | Output directory path for files. Only available when `createFiles` is set to `true`                                            |
| `formatOptions`         | Prettier configuration for formatting generated code                                                                           |
| `baseUrl`               | Can be used to override default Kontent.ai URLs                                                                                |

## Sample models

To see how models are generated have a look at following sample generated models:

1. `delivery-sdk` -> <https://github.com/kontent-ai/model-generator-js/tree/master/sample/delivery>
2. `migration-toolkit` -> <https://github.com/kontent-ai/model-generator-js/tree/master/sample/migration>
3. `sync-sdk` -> <https://github.com/kontent-ai/model-generator-js/tree/master/sample/sync>
4. `environment` -> <https://github.com/kontent-ai/model-generator-js/tree/master/sample/environment>
5. `items` -> <https://github.com/kontent-ai/model-generator-js/tree/master/sample/items>

## Contribution & Feedback

Contributions are welcomed. Simply make a pull request.
