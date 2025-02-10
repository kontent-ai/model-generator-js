import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    root: '.',
    test: {
        dir: 'tests',
        globals: true,
        environment: 'node',
        env: loadEnv('', process.cwd(), '') // loads .env variables
    },
    build: {
        target: 'esnext'
    }
});
