[![Build](https://github.com/kontent-ai/model-generator-js/actions/workflows/build.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/build.yml)
[![Integration Tests](https://github.com/kontent-ai/model-generator-js/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/kontent-ai/model-generator-js/actions/workflows/integration-tests.yml)
[![GitHub license](https://img.shields.io/github/license/kontent-ai/model-generator-js.svg)](https://github.com/kontent-ai/model-generator-js)

# Kontent.ai Model Generators

Developer tools that streamline working with Kontent.ai by generating strongly typed objects and TypeScript models. Each generator is published as its own npm package and is versioned independently.

| Package                                                                                       | CLI                          | Description                                                                                                   |
| --------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`@kontent-ai/delivery-sdk-model-generator`](./packages/delivery-sdk-model-generator)           | `kontent-generate-delivery`  | Models for the [JS Delivery SDK](https://www.npmjs.com/package/@kontent-ai/delivery-sdk)                       |
| [`@kontent-ai/migration-toolkit-model-generator`](./packages/migration-toolkit-model-generator) | `kontent-generate-migration` | Models for the [Migration Toolkit](https://www.npmjs.com/package/@kontent-ai/migration-toolkit)                |
| [`@kontent-ai/sync-sdk-model-generator`](./packages/sync-sdk-model-generator)                   | `kontent-generate-sync`      | Models for the [Sync SDK](https://www.npmjs.com/package/@kontent-ai/sync-sdk)                                  |
| [`@kontent-ai/model-generator`](./packages/model-generator)                                     | `kontent-generate`           | SDK independent models: `environment` (structure of the environment) and `items` (content item codenames/ids) |

SDK specific generators share the major version of the SDK they target (e.g. `@kontent-ai/delivery-sdk-model-generator@17` generates models for `@kontent-ai/delivery-sdk@17`). See the README of each package for installation, compatibility and usage.

## Repository structure

```
lib/        @kontent-ai/model-generator-shared: private code shared by all packages (fetching, formatting, file output, CLI helpers)
packages/   one folder per published package
```

The shared package is never published. Each package bundles the shared code into its own `dist` with [tsdown](https://tsdown.dev), so consumers install a single package.

## Development

Requires Node.js (see `.nvmrc`) and pnpm. Tasks run through [Turborepo](https://turborepo.com), which orders and caches them across packages.

```bash
pnpm install

pnpm build              # build all packages
pnpm typecheck          # type check all workspaces
pnpm test:unit          # unit tests (shared code)
pnpm test:integration   # snapshot tests against a live environment (requires .env, see .env.template)
pnpm lint               # eslint
pnpm biome:fix          # format & fix lint issues
pnpm ci:check           # everything CI runs on pull requests

# work with a single package
pnpm --filter @kontent-ai/delivery-sdk-model-generator build
pnpm --filter @kontent-ai/delivery-sdk-model-generator sample
```

## Releasing

Versioning and publishing is handled by [Changesets](https://github.com/changesets/changesets):

1. In your pull request run `pnpm changeset`, select the affected packages and the bump type, and commit the generated `.changeset/*.md` file. A change to the shared `lib` code must list every package it affects, because the shared package is bundled and not published.
2. After merging to `master`, the release workflow opens (or updates) a `changeset: update versions` pull request that bumps package versions and updates changelogs.
3. Merging that pull request publishes every package whose new version is not on npm yet.

## Contribution & Feedback

Contributions are welcomed. Simply make a pull request.
