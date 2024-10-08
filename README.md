[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator.svg)](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator)
[![Build](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml)
[![GitHub license](https://img.shields.io/github/license/kontent-ai/model-generator-js.svg)](https://github.com/kontent-ai/model-generator-js)

# Kontent.ai Model Generator

The purpose of this library is to help you write better code by using strongly typed objects or Typescript models. There are 4 types of
models you can generate:

1. `delivery-sdk` - Typescript models for [JS Delivery SDK](https://www.npmjs.com/package/@kontent-ai/delivery-sdk) representing Content
   types / taxonomies
2. `migration-toolkit` - Typescript models [Migration Toolkit](https://www.npmjs.com/package/@kontent-ai/migration-toolkit) helping you
   write migration scripts easier
3. `environment` - Strongly typed objects representing all structural objects within an environment (i.e. content types, workflows,
   taxonomies ...). These models help you write scripts because they provide you a straightforward access to objects properties.
4. `items` - Generates `Type` representing all available item codenames for each content type and object representing `id` and `codenames`
   properties of all items. This makes it easy and convenient to reference items in your code.
    > It is not recommended to use this if your environment contains high number of items.

## Installation

Install as a `dev dependency` to your project or use `npx`

```bash
# Install as dev dependency
npm i --save-dev @kontent-ai/model-generator

# Run with npx
npx @kontent-ai/model-generator@latest --help
```

## Usage

Go to folder where you want to create models and run:

```bash
# Models for Delivery SDK
npx @kontent-ai/model-generator@latest delivery --environmentId=x --apiKey=y

# Models for Migration Toolkit
npx @kontent-ai/model-generator@latest migration-toolkit --environmentId=x --apiKey=y

# Environment models used for scripting and strongly typed access to environment objects
npx @kontent-ai/model-generator@latest environment --environmentId=x --apiKey=y

# Items overview with ids / codenames and Types representing available item codenames
# 'deliveryApiKey' option is required for 'preview' or 'secure' api modes
# 'contentTypes' option is CSV of content type codenames and can be used to narrow down generated items
npx @kontent-ai/model-generator@latest items --environmentId=x --apiKey=y --deliveryApiKey=y --apiMode=preview --contentTypes=a,b,c
```

Run with more options:

```bash
npx @kontent-ai/model-generator@latest delivery --environmentId=x --apiKey=y --moduleFileExtension=js --outputDir=kontent-models --addTimestamp=false
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
