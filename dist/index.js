"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => acnBuildPlugin
});
module.exports = __toCommonJS(src_exports);
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_progress = __toESM(require("progress"));
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
          const filePath = import_path.default.resolve(url);
          import_fs.default.readdir(filePath, (err, files) => {
            if (err)
              return;
            files.forEach((filename) => {
              reg1.test(filename) && fileCount++;
              reg.test(filename) && fileCount++;
              const filedir = import_path.default.join(filePath, filename);
              import_fs.default.stat(filedir, (eror, stats) => {
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
            bar = new import_progress.default("building [:bar] :rate/bps :percent :etas", {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
