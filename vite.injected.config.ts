import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        outDir: 'src/scripts',
        emptyOutDir: false,
        rollupOptions: {
            input: resolve(__dirname, 'src/scripts/injected_record_script.ts'),
            output: {
                entryFileNames: 'injected_record_script.js',
                format: 'iife',
                inlineDynamicImports: true
            },
            external: []
        },
        target: 'es2015',
        minify: false
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    }
});