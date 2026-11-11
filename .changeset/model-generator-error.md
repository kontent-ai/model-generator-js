---
"@kontent-ai/model-generator": minor
"@kontent-ai/delivery-sdk-model-generator": minor
"@kontent-ai/migration-toolkit-model-generator": minor
"@kontent-ai/sync-sdk-model-generator": minor
---

All errors thrown by the generators are now instances of `ModelGeneratorError` (exported from each package). The error extends `Error` and carries a `reason` (for example `missingArgument`, `entityNotFound` or `invalidConfig`) and structured `details` with debug information, which the CLI also prints.
