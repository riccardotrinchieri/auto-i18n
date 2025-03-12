import { incrementalTranslation } from "./translations.js";

it("can create simple object translation", async () => {
  const mainLangObject = {
    key: "value",
  };
  expect(
    JSON.stringify(
      await incrementalTranslation(mainLangObject, {}, {}, (x) => x)
    )
  ).toBe(JSON.stringify(mainLangObject));
});

it("can create nested object translation", async () => {
  const mainLangObject = {
    key: "value",

    nested: {
      key: "value",
    },
  };
  expect(
    JSON.stringify(
      await incrementalTranslation(mainLangObject, {}, {}, (x) => x)
    )
  ).toBe(JSON.stringify(mainLangObject));
});

it("can add to existing translations", async () => {
  const mainLangObject = {
    key: "value",

    nested: {
      key: "value",
    },
  };
  expect(
    JSON.stringify(
      await incrementalTranslation(
        mainLangObject,
        {
          key: "value",
        },
        {},
        (x) => x
      )
    )
  ).toBe(JSON.stringify(mainLangObject));
});

it("can add to existing translations nested object", async () => {
  const mainLangObject = {
    key: "value",

    nested: {
      key: "value",

      doubleNested: {
        key: "value",
      },
    },
  };
  expect(
    JSON.stringify(
      await incrementalTranslation(
        mainLangObject,
        {
          key: "value",

          nested: {
            key: "value",
          },
        },
        {},
        (x) => x
      )
    )
  ).toBe(JSON.stringify(mainLangObject));
});

it("can ignore deleted keys", async () => {
  const mainLangObject = {
    key: "value",
  };
  expect(
    JSON.stringify(
      await incrementalTranslation(
        mainLangObject,
        {
          deletedKey: "value",
        },
        {},
        (x) => x
      )
    )
  ).toBe(JSON.stringify(mainLangObject));
});

if (
  ("will remove everything if mainLangObject is empty",
  async () => {
    const mainLangObject = {};
    expect(
      JSON.stringify(
        await incrementalTranslation(
          mainLangObject,
          {
            key: "value",
          },
          {},
          (x) => x
        )
      )
    ).toBe(JSON.stringify(mainLangObject));
  })
);

it("delete + insert scenario", async () => {
  const mainLangObject = {
    key: "value",

    nested: {
      key: "value",

      doubleNested: {
        key: "value",
      },
    },

    adding: "value",
  };
  expect(
    JSON.stringify(
      await incrementalTranslation(
        mainLangObject,
        {
          key: "value",

          nested: {
            key: "value",
          },
        },
        {},
        (x) => x
      )
    )
  ).toBe(JSON.stringify(mainLangObject));
});
