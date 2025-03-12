/**
 * Parse the translation file
 * @param {Record<string, string | Object>} sourceObj - The JSON string of the translation file
 * @param {Record<string, string | Object>} prevTargetObj - The parsed translation file
 * @param {Record<string, string | Object>} newTargetObj - The parsed translation file
 * @param {(text: string) => Promise<string>} translateFn - The translation function
 * @returns {Promise<Record<string, string | Object>>}
 */
export const incrementalTranslation = async (
  sourceObj,
  prevTargetObj,
  newTargetObj,
  translateFn
) => {
  const entries = Object.entries(sourceObj);
  for (const [key, value] of entries) {
    //We find a text that can be translated
    const checkTarget = prevTargetObj?.[key];
    if (typeof value === "string") {
      if (typeof checkTarget === "string") {
        newTargetObj[key] = checkTarget;
      } else {
        newTargetObj[key] = await translateFn(value);
      }
    } else if (typeof value === "object" && Object.keys(value).length > 0) {
      //Handle nested object
      /** @type {Record<string, string | Object>} */
      const newTarget = {};
      newTargetObj[key] = newTarget;
      await incrementalTranslation(
        // @ts-ignore
        value,
        !(
          typeof checkTarget === "object" && Object.keys(checkTarget).length > 0
        )
          ? {}
          : checkTarget,
        newTarget,
        translateFn
      );
    }
  }

  return newTargetObj;
};
