export const decorateWithI18nLLM = (
  t: (text: string, values?: Record<string, string | number>) => string
) => {
  return (string: string, values?: Record<string, string | number>) =>
    t(string.replaceAll("-->", "."), values).replaceAll("$dot", ".");
};
