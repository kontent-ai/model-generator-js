# Code Style

## Functional Programming

- Prefer functional style: pure functions, immutable data, expressions over statements
- Small, single-purpose functions — if a function does more than one thing, split it
- `const` everywhere; never use `let` unless mutation is genuinely unavoidable, never use `var`
- `readonly` on all type properties, function parameters, and array types (`readonly T[]`); exception: a mutable array used as a local accumulator within a single function body (built with `.push()`, never returned or exposed as mutable) is acceptable when the immutable alternative would cause repeated full-array copies — e.g. `[...acc, item]` inside a loop or recursion allocates a new array on every iteration (O(n) per step), whereas `.push()` is O(1) amortised
- Avoid side effects — functions should return values, not mutate external state
- Prefer `map`, `filter`, `reduce`, and other higher-order functions over imperative loops
- Prefer early returns over nested conditionals

## Libraries

- Use **ts-pattern** for non-trivial `switch`/`if-else` chains — anything beyond a simple 2-branch condition should use `match()` from `ts-pattern`
- Use **Zod** to define schemas for all API response payloads and API endpoint inputs — the Zod schema is the source of truth; TypeScript types are always derived via `z.infer<>`, never written by hand alongside a schema

# Tooling

- After making code changes, run `pnpm run biome:fix` to auto-format and fix lint issues

# Monorepo

- pnpm workspace orchestrated by Turborepo; releases are managed with Changesets
- `lib/` is the private `@kontent-ai/model-generator-shared` package: code shared by all generators. It is never published, each package bundles it via tsdown (`deps.alwaysBundle`)
- `packages/*` contain only code specific to that package (generator, config, CLI entry, integration tests, samples). Import shared code from `@kontent-ai/model-generator-shared`, never via relative paths into `lib/`
- Any third-party dependency used by shared code at runtime must also be listed in `dependencies` of each package that reaches it, otherwise tsdown bundles it
- Package identity (generated-file header, tracking header) comes from each package's `src/sdk-info.ts`, which reads its own `package.json`

## Commands

- `pnpm build`, `pnpm typecheck`, `pnpm test:unit`, `pnpm test:integration`, `pnpm lint`, `pnpm ci:check`
- Single package: `pnpm --filter <package-name> <script>`

## Publishing

- Add a changeset (`pnpm changeset`) for every user-facing change, listing all affected packages (a change in `lib/` affects every package that uses it)
- The major version of an SDK generator package must match the major version of the SDK it targets; bump it together with the SDK dependency
- Do not bump versions or publish manually unless asked
