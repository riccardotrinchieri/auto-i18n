#!/usr/bin/env node

import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { Worker } from "node:worker_threads";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { parseConfig } from "./parse-config";
import fg from "fast-glob";
import babelCore from "@babel/core";

import presetEnv from "@babel/preset-env";
//@ts-ignore
import presetReact from "@babel/preset-react";
//@ts-ignore
import presetTypescript from "@babel/preset-typescript";
import babelPluginI18nextExtract from "babel-plugin-i18next-extract";

let currentDirname;

if (typeof __dirname !== "undefined") {
  currentDirname = __dirname;
} else {
  const __filename = fileURLToPath(import.meta.url);
  currentDirname = dirname(__filename);
}

const WORKER_PATH = path.join(currentDirname, "worker.js");

async function main() {
  const config = await parseConfig();

  const mainLanguageFilePath = path.join(
    config.localesPath,
    `${config.mainLang}.json`
  );

  try {
    await fs.access(mainLanguageFilePath);
    const mainLangJSONString = await fs.readFile(mainLanguageFilePath, "utf-8");
    try {
      JSON.parse(mainLangJSONString);
    } catch {
      await fs.writeFile(mainLanguageFilePath, "{}");
    }
  } catch {
    await fs.writeFile(mainLanguageFilePath, "{}");
  }

  const files = await fg(path.join(config.srcFolder, "**/*.{js,jsx,ts,tsx}"));

  for (let file of files) {
    const code = await fs.readFile(file, "utf8");

    babelCore.transformSync(code, {
      filename: file,
      presets: [presetEnv, presetReact, presetTypescript],
      plugins: [
        [
          babelPluginI18nextExtract,
          {
            outputPath: path.join(config.localesPath, "{{ns}}.json"),
            keyAsDefaultValue: true,
            discardOldKeys: true,
            keySeparator: "-->",
            nsSeparator: "==>",
            defaultNS: config.mainLang,
            locales: config.targetLangs,
          },
        ],
      ],
    });
  }

  const getLanguageFilePath = (lang: string) =>
    path.join(config.localesPath, `${lang}.json`);

  const mainLangJSON = await fs.readFile(
    getLanguageFilePath(config.mainLang),
    "utf-8"
  );

  for (const lang of config.targetLangs) {
    new Worker(WORKER_PATH, {
      workerData: {
        lang,
        mainLangJSON,
        mainLang: config.mainLang,
        localesPath: config.localesPath,
        translationWorkUnitSize: config.translationWorkUnitSize,
      },
    });
  }
}

main();

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
