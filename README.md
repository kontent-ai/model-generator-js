[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator.svg)](https://badge.fury.io/js/%40kontent-ai%2Fmodel-generator)
[![Build](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/main.yml)
[![GitHub license](https://img.shields.io/github/license/kontent-ai/model-generator-js.svg)](https://github.com/kontent-ai/model-generator-js)

# Kontent.ai Model Generator

The purpose of this library is to help you write better code by using strongly typed objects or Typescript models. There are 3 types of
models you can generate:

1. `delivery-sdk` - Typescript models for [JS Delivery SDK](https://www.npmjs.com/package/@kontent-ai/delivery-sdk) representing Content
   types / taxonomies
2. `migration-toolkit` - Typescript models [Migration Toolkit](https://www.npmjs.com/package/@kontent-ai/migration-toolkit) helping you
   write migration scripts easier
3. `environment` - Strongly typed objects representing all structural objects within an environment (i.e. content types, workflows,
   taxonomies ...). These models help you write scripts because they provide you a straightforward access to objects properties.

## Installation

Install package globally so you can use it anywhere:

```bash
npm i @kontent-ai/model-generator -g
```

## Use with CLI

Go to folder where you want to create models and run:

```bash
# Models for Delivery SDK
kontent-generate delivery-sdk --environmentId=x --apiKey=y

# Models for Migration Toolkit
kontent-generate migration-toolkit --environmentId=x --apiKey=y

# Environment models used for scripting and strongly typed access to environment objects
kontent-generate environment --environmentId=x --apiKey=y
```

To learn what options are available use the `help` command:

```bash
kontent-generate --help

# or get help for specific command
kontent-generate delivery-sdk --help
```

## Use in code

```typescript
import { generateDeliveryModelsAsync, generateEnvironmentModelsAsync, generateMigrationModelsAsync } from '@kontent-ai/model-generator';

// delivery-sdk models
await generateDeliveryModelsAsync({
    ...
});

// migration-toolkit models
await generateMigrationModelsAsync({
    ...
});

// environment models
await generateEnvironmentModelsAsync({
    ...
});
```

## Sample models

To see how models are generated have a look at following sample generated models:

1. `delivery-sdk` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/delivery
2. `migration-toolkit` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/migration
3. `environment` -> https://github.com/kontent-ai/model-generator-js/tree/master/sample/environment

## Contribution & Feedback

Contributions are welcomed. Simply make a pull request.
