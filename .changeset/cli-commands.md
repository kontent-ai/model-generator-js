---
"@kontent-ai/model-generator": patch
"@kontent-ai/delivery-sdk-model-generator": patch
"@kontent-ai/migration-toolkit-model-generator": patch
"@kontent-ai/sync-sdk-model-generator": patch
---

CLI options are now declared together with the command that uses them, so help output always matches the options a command reads. The `environment` command help now lists `--entities` and `--disableComments`, and the `items` command no longer requires `--deliveryApiKey` (it is only needed when `--apiMode` is `preview` or `secure`).
