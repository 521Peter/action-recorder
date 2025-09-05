import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore - 忽略类型检查
import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";
import { readFileSync } from "fs";

// 直接从manifest文件中读取，绕过类型检查
const manifest = JSON.parse(readFileSync("./manifest.json", "utf-8"));

// 更新manifest以使用正确的入口点
// 注意：使用正确的src/路径前缀
manifest.background.service_worker = "src/background.ts";
manifest.content_scripts[0].js = ["src/content.ts"];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        panel: resolve(__dirname, "src/panel/panel.html"),
        injected_script: resolve(__dirname, "src/injected_script.js"),
        injected_record_script: resolve(__dirname, "src/injected_record_script.ts"),
      },
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: (chunkInfo) => {
          // Keep injected scripts in src/ directory with original names
          if (chunkInfo.name === 'injected_record_script') {
            return `src/${chunkInfo.name}.js`;
          }
          return "assets/[name]-[hash].js";
        },
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    sourcemap: true,
  },
});
