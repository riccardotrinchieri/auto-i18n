import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { z, ZodError } from "zod";
import fs from "fs/promises";

const formatZodError = (zodError: z.ZodError) => {
  const mappedValidationError = zodError.errors.map((zError) => {
    return [`--${zError.path.at(0)}`, zError.message];
  });

  return Object.fromEntries(mappedValidationError);
};

export const parseConfig = async () => {
  const argv = yargs(hideBin(process.argv)).argv;

  const argsValidator = z.object({
    f: z
      .string({
        invalid_type_error: "File path is required use --f <file path>",
        required_error: "File path is required use --f <file path>",
      })
      .optional()
      .default("./auto-i18n-config.json"),
  });

  type Args = z.infer<typeof argsValidator>;

  let args: Args;
  try {
    args = argsValidator.parse(argv);
  } catch (e) {
    throw formatZodError(e as ZodError);
  }

  const ConfigJSON = await fs.readFile(args.f, "utf-8");

  const configValidator = z.object({
    srcFolder: z
      .string({
        invalid_type_error: "Src folder path is required",
        required_error: "Src folder path is required",
      })
      .min(1, "Src folder path is required"),
    localesPath: z
      .string({
        invalid_type_error: "Locales path is required",
        required_error: "Locales path is required",
      })
      .min(1, "Locales path is required"),
    mainLang: z
      .string({
        invalid_type_error: "Main language path is required",
        required_error: "Main language path is required",
      })
      .min(1, "Main language path is required"),
    targetLangs: z
      .array(
        z
          .string({
            invalid_type_error: "Language path is required",
            required_error: "Language path is required",
          })
          .min(1, "Language path is required")
      )
      .min(1, "At least one target language is required"),
    translationWorkUnitSize: z
      .number({
        invalid_type_error: "work unit size must be a number",
        required_error: "work unit size must be a number",
      })
      .int("work unit size must be an integer")
      .min(1, "work unit size must be at least 1")
      .default(5),
  });

  type Config = z.infer<typeof configValidator>;

  let config: Config;
  try {
    config = configValidator.parse(JSON.parse(ConfigJSON));
  } catch (e) {
    throw formatZodError(e as ZodError);
  }

  return config;
};
