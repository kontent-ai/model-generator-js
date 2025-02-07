import { name, version } from '../package.json' with { type: 'json' };
import { createVersionFile } from './utils/script.utils.js';

createVersionFile({
    date: new Date(),
    filePath: './lib/meta/metadata.ts',
    propertyName: 'libMetadata',
    packageName: name,
    packageVersion: version
});
