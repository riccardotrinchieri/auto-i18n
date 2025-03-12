# i18n-llm

**i18n-llm** is an internationalization tool designed to automatically extract the primary language locale directly from your codebase and leveraging the LLMs to generete additional locale files for multiple target languages, saving you time and effort in the localization process.

1. [Usage Guide](#usage-guide)
2. [Features](#features)
3. [Installation](#installation)
4. [React Setup](#react-setup)
5. [Next JS Setup](#next-js-setup)

## Usage Guide

After installing the package create a **i18n-llm-config.json** in the root of the project.

```javascript
/*i18n-llm-config.json*/

{
  /*The path to the folder that will contain your locales*/
  "localesPath": "./src/translations/locales",

  /* The main language of your project i.e. en"*/
  "mainLang": "en",


  /**
  * The folder containing your code.
  * All .js, .ts .jsx and .tsx files in this folder will be evaluated
  * for the main locale file automatic extraction
  **/
  "srcFolder": "./src",

  /* The target languages the main locale file needs to be translated into*/
  "targetLangs": ["it", "fr"],

  /**
  * Optional, default to 5.
  * Determine how many texts will be sent for translation in a single LLM call
  * Useful for reducing token usage, avoiding rate limits or avoiding exceeding context limits
  **/
  "translationWorkUnitSize": 5,
}
```

Add to your **.env**

```
OPENAI_API_KEY=...YOUR OPEN AI KEY...
```

> **Note:** You can choose any **i18n** library, but it is important that such lib use a function named **t** to perform translations. If that is not the case you need to wrap the translation function in a function named **t**.

When using your **i18n** library you need to adhere to this syntax in order for the project to work

```javascript
t("Homepage-->This is the tile of my homepage");
```

During the **extraction** process **-->** will be evaluated as a key separator. Supposing **en** is the main language in the config file the extraction process will generate the following JSON

```javascript
/*en.json*/

{
  "Homepage": {
    "This is the tile of my homepage": "This is the tile of my homepage"
  }
}
```

> **Note:** In order to make the process as automatic as possible the last piece of the key needs to be the translation in the main language itself

To run the extraction and translation process

```
npx i18n-llm

//or

pnpm i18n-llm

// Use --f path/to/config to specify the path to the config file if not located in the default path

```

## Features

- [x] ⚙️ Automatic extraction of the main locale file directly from the codebase.
- [x] ⚙️ Automatic translation of the extract locale file in multiple target languages.
- [x] ♻️ Incremental updates. On subsequent runs, only new non translated keys will be considered.
- [x] 🗑️ Automatic removal of the unused translation keys.
- [x] 🚗 Multi-thread translation process. "One Worker thread per language is used to speed up translations.
- [x] 📦 Translations batching: decide how many texts will be sent for translation in a single LLM call.
- [ ] Customizable prompt.
- [ ] Multi model support.
- [ ] Customizable key separator.

It is also possible to manually fix any translation error made by the LLM without side effects

## Installation

```
npm install --save i18n-llm

//or

pnpm add i18n-llm
```

## React Setup

You may succeeding in setting up this package with a different **i18n** lib. The following is to be considered just one possible approach.

Install [**i18next**](https://www.npmjs.com/package/i18next), [**i18next-browser-languagedetector**](https://www.npmjs.com/package/i18next-browser-languagedetector/v/3.0.0) , [**react-i18next**](https://www.npmjs.com/package/react-i18next).

See [**Usage Guide**](#usage-guide) to configure i18n-llm.

Create a folder **src/translations**, add the locale folder **src/translations/locales**, add the i18next init file **src/translations/i18n.(ts|js)** and configure it as follows:

> **Note:** Change fallbackLng, supportedLngs, resources and locales imports as needed.

> **Note:** Locales import do not exists previous the first execution of i18n-llm so you may receive an error. Run the i18n-llm executable to fix it.

```JSX
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en.json";
import itTranslation from "./locales/it.json";
import frTranslation from "./locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: { order: ["navigator"] },
    resources: {
      en: {
        translation: enTranslation,
      },
      it: {
        translation: itTranslation,
      },
      fr: {
        translation: frTranslation,
      },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "it", "fr"],
    keySeparator: "-->",
    nsSeparator: "==>",
  });

export default i18n;
```

In you **React** code

```JSX
/*App.tsx*/

import { useTranslation } from "react-i18next";
import "./translations/i18n"; /*Import just once in the root of the project*/

function App() {
  const { t } = useTranslation();

  return (
    <>
      <div>{t("Hello")}</div>
      <div>{t("homepage-->text-->How are you?")}</div>

      <div>{t("settings-->Language")}</div>
    </>
  );
}

export default App;
```

## Next JS Setup

You may succeeding in setting up this package with a different i18n lib. The following is to be considered just one possible approach.

Install [**next-intl**](https://www.npmjs.com/package/next-intl) and follow the [setup guide](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) : **App router with i18n routing**.

See [**Usage Guide**](#usage-guide) to configure i18n-llm.

You should now have an **i18n** folder. This folder add the following 4 files.

```javascript
/*decorator.ts*/
export const decorateWithI18nLLM = (
  t: (text: string, values?: Record<string, string | number>) => string
) => {
  return (string: string, values?: Record<string, string | number>) =>
    t(string.replaceAll("-->", "."), values).replaceAll("$dot", ".");
};
```

```javascript
/*server.ts*/
import { getTranslations } from "next-intl/server";
import { decorateWithI18nLLM } from "./decorator";

export const getTranslations = async () => {
  const t = await getTranslations();
  return decorateWithI18nLLM(t);
};
```

```javascript
/*hook.ts*/
import { useTranslations as useTranslationsNextIntl } from "next-intl";
import { decorateWithI18nLLM } from "./decorator";

export function useTranslations() {
  const t = useTranslationsNextIntl();
  return decorateWithI18nLLM(t);
}
```

> **Note:** We need this wrapper to the original **useTranslationsNextIntl** and **getTranslations** since, at the best of my knowledge, the library does not allow customization of the **key separator** and simply uses "." which will not work with this package that requires key separtor to be "-->" , in addition, this prevent "." from being used in the translation key which is not optimal in the setup of this package. To avoid this limitation the wrapper function threats "$dot" as "." so you may write "$dot" insted of "." in the translation key. (This of course comes with a small overhead)

```javascript
/*api.ts*/
export function t(s: string) {
  return s;
}
```

> **Note:** This identity function will be useful inside API routes if we want to be able to translate API responses i.e. error message. (Also in this case this cause with a small overhead)

Check the [**NextJS example folder**](https://gitlab.com/riccardoluigi.trinchieri/i18n-llm/-/tree/main/examples/next?ref_type=heads) for a minimal working example
