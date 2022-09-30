// src/index.ts
import fs from "fs";
import path from "path";
import progress from "progress";
function acnBuildPlugin() {
  let fileCount = 0;
  let transformCount = 0;
  let bar;
  return {
    name: "icourt-build-plugin",
    enforce: "pre",
    apply: "build",
    config(config, { command }) {
      if (command === "build") {
        const reg1 = /\./gi;
        const reg = /\.(vue)$/gi;
        const fileDisplay = (url, cb) => {
          const filePath = path.resolve(url);
          fs.readdir(filePath, (err, files) => {
            if (err)
              return;
            files.forEach((filename) => {
              reg1.test(filename) && fileCount++;
              reg.test(filename) && fileCount++;
              const filedir = path.join(filePath, filename);
              fs.stat(filedir, (eror, stats) => {
                if (eror)
                  return;
                const isFile = stats.isFile();
                const isDir = stats.isDirectory();
                if (isFile) {
                }
                if (isDir)
                  fileDisplay(filedir, cb);
              });
            });
            bar = new progress("building [:bar] :rate/bps :percent :etas", {
              width: 40,
              complete: "\x1B[43m \x1B[0m",
              incomplete: "\x1B[47m \x1B[0m",
              total: fileCount
            });
          });
        };
        fileDisplay("./src", (arr) => {
        });
      }
    },
    transform(code, id) {
      const reg = /node_modules/gi;
      if (!reg.test(id)) {
        transformCount++;
        transformCount < fileCount + 1 && bar.tick();
      }
    },
    configResolved(resolvedConfig) {
    },
    configureServer(server) {
    },
    transformIndexHtml(html) {
    }
  };
}
export {
  acnBuildPlugin as default
};
