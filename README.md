[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator.svg)](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator)
[![Build](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml)
[![GitHub license](https://img.shields.io/github/license/kontent-ai/model-generator-js.svg)](https://github.com/kontent-ai/model-generator-js)

# Kontent.ai Model Generator

The Kontent.ai Model Generator is a library designed to enhance your development experience by enabling the use of strongly typed objects
and TypeScript models. It supports the generation of four distinct types of models:

1. `delivery-sdk` - Generates TypeScript models for the [JS Delivery SDK](https://www.npmjs.com/package/@kontent-ai/delivery-sdk). These
   models include content types, taxonomies, and codename-based types representing elements such as workflow steps, languages, and more.

> Recommended: Using these models is highly encouraged when working with the JavaScript Delivery SDK, as they provide robust type safety and
> streamline development.

2. `migration-toolkit` - Creates TypeScript models for the [Migration Toolkit](https://www.npmjs.com/package/@kontent-ai/migration-toolkit).
   These models help simplify and standardize the process of writing migration scripts.
3. `environment` - Generates JavaScript objects (not TypeScript types) representing the entire structure of your environment—including
   content types, workflows, languages, and taxonomies. These objects provide comprehensive access to environment metadata.

> Note: Due to their potentially large size, these objects are intended for use in backend/server-side code only. Avoid including them in
> client-side applications to prevent unnecessary bundle size and exposure of sensitive data.

4. `items` - Produces TypeScript types for all item codenames, along with objects containing the id and codename of each item. This is
   particularly useful when referencing a set of items in your code, enabling type-safe access instead of relying on hardcoded strings.

> Caution: This option is not recommended for environments with a large volume of content items, as it may lead to performance or
> scalability issues during code generation.

## Installation

Install as a `dev dependency` to your project or use `npx`

```bash
# Install as dev dependency
npm i --save-dev @kontent-ai/model-generator

# Run with npx
npx @kontent-ai/model-generator@latest --help
```

## CLI Usage

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

Run with more options:

```bash
npx @kontent-ai/model-generator@latest delivery --environmentId=x --managementApiKey=y --moduleFileExtension=js --outputDir=kontent-models --addTimestamp=false
```

To learn what options are available use the `help` command:

```bash
npx @kontent-ai/model-generator@latest  --help

# or get help for specific command
npx @kontent-ai/model-generator@latest delivery-sdk --help
```

## Use in code

```typescript
import { generateDeliveryModelsAsync, generateEnvironmentModelsAsync, generateMigrationModelsAsync, generateItemsAsync } from '@kontent-ai/model-generator';

// delivery-sdk models
await generateDeliveryModelsAsync({
    ...
});

// migration-toolkit models
await generateMigrationModelsAsync({
    ...
});

// environment overview
await generateEnvironmentModelsAsync({
    ...
});

// items
await generateItemsAsync({
    ...
});
```

## Sample models

To see how models are generated have a look at following sample generated models:

1. `delivery-sdk` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/delivery
2. `migration-toolkit` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/migration
3. `environment` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/environment
4. `items` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/items

## Contribution & Feedback

Contributions are welcomed. Simply make a pull request.
