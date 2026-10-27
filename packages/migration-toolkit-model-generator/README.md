[![npm version](https://badge.fury.io/js/%40kontent-ai%2Fmigration-toolkit-model-generator.svg)](https://www.npmjs.com/package/@kontent-ai/migration-toolkit-model-generator)
[![Build](https://github.com/kontent-ai/model-generator-js/actions/workflows/build.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/build.yml)
[![Integration Tests](https://github.com/kontent-ai/model-generator-js/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/integration-tests.yml)
[![GitHub license](https://img.shields.io/github/license/kontent-ai/model-generator-js.svg)](https://github.com/kontent-ai/model-generator-js)

# Kontent.ai Migration Toolkit Model Generator

Creates TypeScript models for the [Migration Toolkit](https://www.npmjs.com/package/@kontent-ai/migration-toolkit). These models help simplify and standardize the process of writing migration scripts.

## Installation

You can install the generator globally, add it as a development dependency, or simply run it using npx for convenience.

```bash
# Install globally (exposes the `kontent-generate-migration` command)
npm i @kontent-ai/migration-toolkit-model-generator@latest -g

# Install as dev dependency and use in your code
npm i @kontent-ai/migration-toolkit-model-generator@latest --save-dev

# Run with npx
npx @kontent-ai/migration-toolkit-model-generator@latest --help
```

## Compatibility

The major version of this generator matches the major version of the Migration Toolkit it targets:

| Model generator                                          | Migration Toolkit ([`@kontent-ai/migration-toolkit`](https://www.npmjs.com/package/@kontent-ai/migration-toolkit)) |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `@kontent-ai/migration-toolkit-model-generator` `3.x.y` | `3.x.y`                                                                                                             |

## Usage

Basic usage

```bash
npx @kontent-ai/migration-toolkit-model-generator@latest
    --environmentId=<id>
    --managementApiKey=<key>
```

Usage with options

```bash
npx @kontent-ai/migration-toolkit-model-generator@latest
    --environmentId=<id>
    --managementApiKey=<key>
    --outputDir=<path>
    --moduleFileExtension=<js | ts | none | mts | mjs>
    --addTimestamp=<true, false>
    --disableComments=<true, false>
    --managementBaseUrl=<proxyUrl>
```

```typescript
import { generateMigrationModelsAsync } from '@kontent-ai/migration-toolkit-model-generator';

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
    formatOptions: { indentSize: 4, quote: 'single' },
    disableComments: false
});
```

Configuration

| Option                | Description                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `environmentId`       | Id of Kontent.ai environment                                                                                                   |
| `managementApiKey`    | Management API key                                                                                                             |
| `moduleFileExtension` | Extension used for imports in generated models.                                                                                |
| `addTimestamp`        | Indicates if models contain timestamp                                                                                          |
| `disableComments`     | If enabled, no comments will be included in the generated files                                                               |
| `createFiles`         | If enabled, files will be created on FileSystem. When disabled you may iterate over the result and process the files yourself. |
| `outputDir`           | Output directory path for files. Only available when `createFiles` is set to `true`                                            |
| `formatOptions`       | Configuration for formatting generated code                                                                           |
| `baseUrl`             | Can be used to override default Kontent.ai URLs                                                                                |

## Sample models

See the [sample generated models](https://github.com/kontent-ai/model-generator-js/tree/master/packages/migration-toolkit-model-generator/sample).


## Contribution & Feedback

Contributions are welcomed. This package is part of the [model-generator-js monorepo](https://github.com/kontent-ai/model-generator-js), simply make a pull request there.
