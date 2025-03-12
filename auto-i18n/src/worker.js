// @ts-check

import { workerData } from "worker_threads";
import * as fs from "fs/promises";
import * as path from "path";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { incrementalTranslation } from "./translations.js";
import { v4 as uuidv4 } from "uuid";

import z from "zod";

/**
 * @typedef {Object} WorkerData
 * @property {string} lang - The target translation language
 * @property {string} mainLang - The source translation language
 * @property {string} mainLangJSON - The JSON string of the main language
 * @property {string} localesPath - The directory in wich the translation files will be written
 * @property {number} translationWorkUnitSize - The number of translations to be sent in a single LLM request
 */

/**
 * Execute the translation process
 * @param {WorkerData} workerData - The data passed to the worker from the main thread
 * @returns {Promise<void>}
 */
async function translate(workerData) {
  const { lang, mainLang, mainLangJSON, localesPath } = workerData;
  const doesLangFileExist = await fs
    .access(getLanguageFilePath(localesPath, lang))
    .then(() => true)
    .catch(() => false);

  const targetLangJSON = doesLangFileExist
    ? await fs.readFile(getLanguageFilePath(localesPath, lang), "utf-8")
    : "{}";

  const mainLangObject = parseTranslationJson(mainLangJSON);
  const targetLangObject = parseTranslationJson(targetLangJSON);

  /** @type {Record<string, string | Object>} */
  let newTargetLangObject = {};

  /** @type {Array<{id: string, text: string}>} */
  const transaltionsQueue = [];

  /** @type {(text: string) => Promise<string> } */
  const translateFn = async (text) => {
    const id = uuidv4();
    transaltionsQueue.push({ id, text });
    return id;
  };

  newTargetLangObject = await incrementalTranslation(
    mainLangObject,
    targetLangObject,
    newTargetLangObject,
    translateFn
  );

  /** @type {Array<typeof transaltionsQueue>} */
  const translationsQueueChunks = [];
  const chunkSize = workerData.translationWorkUnitSize;

  for (let i = 0; i < transaltionsQueue.length; i += chunkSize) {
    translationsQueueChunks.push(transaltionsQueue.slice(i, i + chunkSize));
  }

  /** @type {typeof transaltionsQueue} */
  const translatedTexts = [];

  for (const chunk of translationsQueueChunks) {
    await generateObject({
      model: openai("gpt-4o-mini"),
      system: `Translate the provided texts from ${mainLang} to ${lang}`,
      prompt: `${chunk
        .map(({ text, id }) => `ID: ${id} / Text content: ${text}`)
        .join("\n")}`,
      schema: z.object({
        translations: z.array(
          z.object({
            id: z.string().describe("The id of the original text"),
            translation: z.string().describe("The translated text"),
          })
        ),
      }),
    }).then((res) => {
      translatedTexts.push(
        ...res.object.translations.map(({ id, translation }) => ({
          id,
          text: translation,
        }))
      );
    });
  }

  let JSONResult = JSON.stringify(newTargetLangObject);
  translatedTexts.forEach(({ id, text }) => {
    JSONResult = JSONResult.replace(`"${id}"`, `"${text}"`);
  });

  await fs.writeFile(getLanguageFilePath(localesPath, lang), JSONResult);

  return;
}

/**
 * Extract the path to the locale file for the given language
 * @param {string} localesPath - The directory in wich the translation files will be written
 * @param {string} lang - The language of the locale file
 * @returns {string} - The path to the locale file
 */
const getLanguageFilePath = (localesPath, lang) =>
  path.join(localesPath, `${lang}.json`);

/**
 * Parse the translation file
 * @param {string} json - The JSON string of the translation file
 * @returns {Record<string, string | Object>} - The parsed translation file
 */
const parseTranslationJson = (json) => {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
};

translate(workerData);
