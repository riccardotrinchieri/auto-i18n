import fs from "fs";
import path from "path";

export const copyFilesPlugin = ({ files }) => ({
  name: "copy-files-plugin",
  setup(build) {
    build.onEnd(() => {
      let outdir = build.initialOptions.outdir;

      if (!outdir) {
        outdir = path.dirname(build.initialOptions.outfile);
      }

      files.forEach((file) => {
        const dest = path.join(outdir, path.basename(file));
        fs.copyFileSync(file, dest);
      });
    });
  },
});
