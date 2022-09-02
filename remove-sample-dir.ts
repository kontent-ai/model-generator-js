import { rmSync, existsSync } from 'fs';

const sampleDir = 'sample';

if (existsSync(sampleDir)) {
    rmSync('sample', { recursive: true, force: true });
}
