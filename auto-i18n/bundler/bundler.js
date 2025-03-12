import esbuild from "esbuild";
import esbuildPluginTsc from "esbuild-plugin-tsc";

import { copyFilesPlugin } from "./plugins/copy.js";

esbuild
  .build({
    entryPoints: ["./src/bin.ts"],
    bundle: true,
    outfile: "./dist/bin.cjs",
    format: "cjs",
    platform: "node",
    plugins: [
      esbuildPluginTsc({
        tsconfig: "./tsconfig.json",
      }),
      copyFilesPlugin({
        files: ["./src/worker.js", "./src/translations.js"],
      }),
    ],
  })
  .catch(() => process.exit(1));
