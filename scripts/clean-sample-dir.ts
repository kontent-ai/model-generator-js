import { rmSync, existsSync, mkdirSync } from 'fs';

const sampleDir = 'sample';

if (existsSync(sampleDir)) {
    rmSync(sampleDir, { recursive: true, force: true });
}

mkdirSync(sampleDir);
