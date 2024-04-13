import { createVersionFile } from './file-version-script.js';

const date = new Date();

const versionFilePath = './lib/meta/metadata.ts';
const versionProp = 'libMetadata';

createVersionFile(date, versionFilePath, versionProp);
