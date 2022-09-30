/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PluginOption } from 'vite';
// import rd from 'rd';
import fs from "fs";
import path from "path";
import progress from 'progress';

// public static final String ANSI_RESET = "\u001B[0m";
// public static final String ANSI_BLACK = "\u001B[30m";
// public static final String ANSI_RED = "\u001B[31m";
// public static final String ANSI_GREEN = "\u001B[32m";
// public static final String ANSI_YELLOW = "\u001B[33m";
// public static final String ANSI_BLUE = "\u001B[34m";
// public static final String ANSI_PURPLE = "\u001B[35m";
// public static final String ANSI_CYAN = "\u001B[36m";
// public static final String ANSI_WHITE = "\u001B[37m";

export default function acnBuildPlugin(): PluginOption {
  let fileCount = 0
  let transformCount = 0
  // const transformed = 0 // 当前已转换的数量
  let bar: progress;
  return {
    // 插件名称
    name: 'icourt-build-plugin',
    // pre 会较于 post 先执行
    enforce: 'pre', // post
    // 指明它们仅在 'build' 或 'serve' 模式时调用
    apply: 'build', // apply 亦可以是一个函数
    config(config, { command }) {
      if (command === 'build') {
        const reg1 = /\./gi;
        const reg = /\.(vue)$/gi;
        const fileDisplay = (url, cb) => {
          const filePath = path.resolve(url);
          //根据文件路径读取文件，返回文件列表
          fs.readdir(filePath, (err, files) => {
            if (err) return 
            // console.log('files', files);
            files.forEach((filename) => {
              //获取当前文件的绝对路径
              reg1.test(filename) && fileCount ++;
              reg.test(filename) && fileCount++;
              // console.log("fileCount",fileCount);
              const filedir = path.join(filePath, filename);
              // fs.stat(path)执行后，会将stats类的实例返回给其回调函数。
              fs.stat(filedir, (eror, stats) => {
                if (eror) return 
                // 是否是文件
                const isFile = stats.isFile();
                // 是否是文件夹
                const isDir = stats.isDirectory();
                if (isFile) {
                  // 这块我自己处理了多余的绝对路径，第一个 replace 是替换掉那个路径，第二个是所有满足\\的直接替换掉
                  // arr.push(filedir.replace(__dirname, '').replace(/\\/img, '/'))
                  // // 最后打印的就是完整的文件路径了
                  // if (timer) clearTimeout(timer)
                  // timer = setTimeout(() => cb && cb(arr), 200)
                }
                // 如果是文件夹
                if (isDir) fileDisplay(filedir, cb);
                // cb()
              })
            });
            //  console.log(11112,fileCount);
                 bar = new progress('building [:bar] :rate/bps :percent :etas', {
                  width: 40,
                    // complete: '\u2593',
                    // incomplete: '\u2591',
                complete: '\u001B[43m \u001b[0m',
                incomplete: '\u001B[47m \u001b[0m',
                total: fileCount
              });
          });
        }
        // 测试代码
        fileDisplay('./src', (arr) => {
          console.log(1111,fileCount);
        })
      }
    },
    transform(code, id) {		
      const reg = /node_modules/gi;
      if (!reg.test(id)) {
        transformCount++
        // percent = +(transformCount / 120).toFixed(2)	
        transformCount < (fileCount+ 1) && bar.tick();
      }
    },
    configResolved(resolvedConfig) {
      // console.log('这里是configResolved钩子1');
    },

    configureServer(server) {
      // console.log('这里是configureServer钩子1');
    },

    transformIndexHtml(html) {
      // console.log('这里是transformIndexHtml钩子1');
    },
  }
}