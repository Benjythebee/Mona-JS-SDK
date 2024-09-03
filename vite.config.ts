/// <reference types="vitest" />
import dts from "vite-plugin-dts"
import path from "path"
import { defineConfig, UserConfig } from "vite"

export default defineConfig({
  base: "./",
  plugins: [dts({ rollupTypes: true })],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "monaJsSdk",
      formats: ["es", "cjs", "umd", "iife"],
      fileName: (format) => `index.${format}.js`,
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    exclude: [],
  },
} satisfies UserConfig);
