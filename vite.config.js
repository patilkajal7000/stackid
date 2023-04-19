/// <reference types="vitest" />
/// <reference types="vite/client" />

import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react';
import vitePluginRequire from 'vite-plugin-require';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
        reporter: ['text', 'json', 'html'],
    },
    build: {
        outDir: 'build',
    },
    server: {
        open: true,
        port: 3006,
    },
    preview: {
        port: 3006,
    },
    plugins: [
        visualizer({
            emitFile: true,
            file: 'stats.html',
        }),
        react(),
        eslint(),
        vitePluginRequire({}),
    ],
    css: {
        devSourcemap: true,
    },
    resolve: {
        alias: [
            {
                find: 'assets',
                replacement: resolve(__dirname, 'src/assets'),
            },
            {
                find: 'core',
                replacement: resolve(__dirname, 'src/core'),
            },
            {
                find: 'environment',
                replacement: resolve(__dirname, 'src/environment'),
            },
            {
                find: 'modules',
                replacement: resolve(__dirname, 'src/modules'),
            },
            {
                find: 'scss',
                replacement: resolve(__dirname, 'src/scss'),
            },
            {
                find: 'shared',
                replacement: resolve(__dirname, 'src/shared'),
            },
            {
                find: 'store',
                replacement: resolve(__dirname, 'src/store'),
            },
            {
                find: 'translation',
                replacement: resolve(__dirname, 'src/translation'),
            },
            {
                find: 'types',
                replacement: resolve(__dirname, 'src/types'),
            },
        ],
    },
});
