[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator.svg)](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator)
[![Build](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml)
[![GitHub license](https://img.shields.io/github/license/kontent-ai/model-generator-js.svg)](https://github.com/kontent-ai/model-generator-js)

# Kontent.ai Model Generator

The Kontent.ai Model Generator is a library designed to enhance your development experience by enabling the use of strongly typed objects
and TypeScript models. It supports the generation of four distinct types of models:

| Model type                                     | Description                                                                                                                                                                                                                                                    |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [delivery-sdk](#delivery-sdk-models)           | Generates TypeScript models for the [JS Delivery SDK](https://www.npmjs.com/package/@kontent-ai/delivery-sdk). These models include content types, taxonomies, and codename-based types representing elements such as workflow steps, languages, and more.     |
| [migration-toolkit](#migration-toolkit-models) | Creates TypeScript models for the [Migration Toolkit](https://www.npmjs.com/package/@kontent-ai/migration-toolkit). These models help simplify and standardize the process of writing migration scripts.                                                       |
| [environment](#environment-models)             | Generates JavaScript objects (not TypeScript types) representing the entire structure of your environment — including content types, workflows, languages, and taxonomies. These objects provide comprehensive access to environment metadata.                 |
| [items](#item-models)                          | Produces TypeScript types for all item codenames, along with objects containing the id and codename of each item. This is particularly useful when referencing a set of items in your code, enabling type-safe access instead of relying on hardcoded strings. |

## Installation

Install as a `dev dependency` to your project or use `npx`

```bash
# Install as dev dependency
npm i --save-dev @kontent-ai/model-generator

# Run with npx
npx @kontent-ai/model-generator@latest --help
```

## Basic usage

```bash
# Models for Delivery SDK
npx @kontent-ai/model-generator@latest delivery --environmentId=x --managementApiKey=y

# Models for Migration Toolkit
npx @kontent-ai/model-generator@latest migration-toolkit --environmentId=x --managementApiKey=y

# Environment models used for scripting and strongly typed access to environment objects
npx @kontent-ai/model-generator@latest environment --environmentId=x --managementApiKey=y

# Items overview with ids / codenames and Types representing available item codenames
# 'deliveryApiKey' option is required for 'preview' or 'secure' api modes
# 'contentTypes' option is CSV of content type codenames and can be used to narrow down generated items
npx @kontent-ai/model-generator@latest items --environmentId=x --managementApiKey=y --deliveryApiKey=y --apiMode=preview --contentTypes=a,b,c
```

### CLI Help

```bash
# General help
npx @kontent-ai/model-generator@latest  --help

# Or get help for specific command
npx @kontent-ai/model-generator@latest delivery-sdk --help
```

## Delivery SDK Models

> Recommended: Using these models is highly encouraged when working with the JavaScript Delivery SDK, as they provide robust type safety and
> streamline development.

```bash
npx @kontent-ai/model-generator@latest delivery --environmentId=x --managementApiKey=y
```

```typescript
import { generateDeliveryModelsAsync } from '@kontent-ai/model-generator';

await generateDeliveryModelsAsync({
    // required
    environmentId: 'x',
    apiKey: 'y',
    moduleFileExtension: 'js',
    addTimestamp: false,
    createFiles: true,
    outputDir: '/', // only required when createFiles is true

    // optional
    fileResolvers: { contentType: 'camelCase', snippet: 'camelCase', taxonomy: 'camelCase' },
    nameResolvers: { contentType: (item) => `Company_${item.codename}`, snippet: 'pascalCase', taxonomy: 'pascalCase' },
    formatOptions: { indentSize: 4, quote: 'single' },
    baseUrl: undefined
});
```

Configuration

| Option                | Description                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `environmentId`       | Id of Kontent.ai environment                                                                                                   |
| `apiKey`              | Management API key                                                                                                             |
| `moduleFileExtension` | Extension used for imports in generated models.                                                                                |
| `addTimestamp`        | Indicates if models contain timestamp                                                                                          |
| `createFiles`         | If enabled, files will be created on FileSystem. When disabled you may iterate over the result and process the files yourself. |
| `outputDir`           | Output directory path for files. Only available when `createFiles` is set to `true`                                            |
| `fileResolvers`       | Can be used to customize the generated filenames                                                                               |
| `nameResolvers`       | Can be used to customize names of generated types                                                                              |
| `formatOptions`       | Prettier configuration for formatting generated code                                                                           |
| `baseUrl`             | Can be used to override default Kontent.ai URLs                                                                                |

## Migration toolkit models

```bash
npx @kontent-ai/model-generator@latest migration-toolkit --environmentId=x --managementApiKey=y
```

```typescript
import { generateMigrationModelsAsync } from '@kontent-ai/model-generator';

await generateMigrationModelsAsync({
    // required
    environmentId: 'x',
    apiKey: 'y',
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
| `apiKey`              | Management API key                                                                                                             |
| `moduleFileExtension` | Extension used for imports in generated models.                                                                                |
| `addTimestamp`        | Indicates if models contain timestamp                                                                                          |
| `createFiles`         | If enabled, files will be created on FileSystem. When disabled you may iterate over the result and process the files yourself. |
| `outputDir`           | Output directory path for files. Only available when `createFiles` is set to `true`                                            |
| `formatOptions`       | Prettier configuration for formatting generated code                                                                           |
| `baseUrl`             | Can be used to override default Kontent.ai URLs                                                                                |

## Environment models

> Note: Due to their potentially large size, these objects are intended for use in backend/server-side code only. Avoid including them in
> client-side applications to prevent unnecessary bundle size and exposure of sensitive data.

```bash
npx @kontent-ai/model-generator@latest environment --environmentId=x --managementApiKey=y
```

```typescript
import { generateEnvironmentModelsAsync } from '@kontent-ai/model-generator';

await generateEnvironmentModelsAsync({
    // required
    environmentId: 'x',
    apiKey: 'y',
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
| `apiKey`              | Management API key                                                                                                             |
| `entities`            | Array of entity types that will be exported                                                                                    |
| `moduleFileExtension` | Extension used for imports in generated models.                                                                                |
| `addTimestamp`        | Indicates if models contain timestamp                                                                                          |
| `createFiles`         | If enabled, files will be created on FileSystem. When disabled you may iterate over the result and process the files yourself. |
| `outputDir`           | Output directory path for files. Only available when `createFiles` is set to `true`                                            |
| `formatOptions`       | Prettier configuration for formatting generated code                                                                           |
| `baseUrl`             | Can be used to override default Kontent.ai URLs                                                                                |

## Item models

> Caution: This option is not recommended for environments with a large volume of content items, as it may lead to performance or
> scalability issues during code generation.

```bash
# 'deliveryApiKey' option is required for 'preview' or 'secure' api modes
# 'contentTypes' option is CSV of content type codenames and can be used to narrow down generated items
npx @kontent-ai/model-generator@latest items --environmentId=x --managementApiKey=y --deliveryApiKey=y --apiMode=preview
```

```typescript
import { generateItemsAsync } from '@kontent-ai/model-generator';

await generateItemsAsync({
    // required
    environmentId: 'x',
    apiKey: 'y',
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
| `apiKey`                | Management API key                                                                                                             |
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

1. `delivery-sdk` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/delivery
2. `migration-toolkit` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/migration
3. `environment` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/environment
4. `items` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/items

## Contribution & Feedback

Contributions are welcomed. Simply make a pull request.
