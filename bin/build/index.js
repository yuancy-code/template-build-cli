#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ejsExec = require("./ejs");
const mapDir = require("./map-dir");

/**
 * 拷贝目录
 * @param {String} dir 需要复制的目录
 * @param {String} dirNew 负责后的目录
 */
async function copyFiles(dir, dirNew) {
  try {
    await fs.copy(dir, dirNew);
    console.log(chalk.green("[√]Copy file success!"));
  } catch (err) {
    console.error(chalk.red("[×]Copy file not exists!"));
  }
}
/**
 * 获取输出目录
 * @param {String} dirName 当前所在目录
 * @param {String} output 输出目录
 */
function getNewPath(dirName, output) {
  let dirBaseName = path.basename(dirName); // 当前文件夹名称
  let newPath = path.join(dirName, output);
  if (path.isAbsolute(output)) {
    newPath = output;
  }
  return path.join(newPath, "output", `${dirBaseName}_${new Date().getTime()}`);
}

/**
 * 开始构建
 * @param {Object} options 配置
 */
async function build(options) {
  let outputDir = options.output;
  let execPath = process.cwd(); // 当前目录
  // let dirBaseName = path.basename(execPath); // 当前文件夹名称
  let newPath = getNewPath(execPath, outputDir);
  // return false;
  // let newPath = path.join(execPath, "output", copyDirNew);
  // let newPathEjs = path.join(execPath, "new", copyDirNew, "index.ejs");
  // let newPathData = path.join(execPath, "new", copyDirNew, "index.data.json");
  const exists = await fs.pathExists(newPath);
  try {
    if (!exists) {
      // 复制文件夹
      console.log(chalk.green("[→]Copy file begin!"));
      await copyFiles(execPath, newPath);
      mapDir(
        newPath,
        async function(pathname, data) {
          // console.log('TCL: file', file.toString())
          let extname = path.extname(pathname);
          if (extname !== ".json") {
            return false;
          }
          let pathNameUnExt = pathname.replace(/(.*)\.json$/g, function(
            $1,
            $2
          ) {
            return $2;
          });
          let ejsPathName = `${pathNameUnExt}.ejs`;
          let hasEjs = null;
          try {
            hasEjs = await fs.exists(ejsPathName);
            if (hasEjs) {
              ejsExec(pathNameUnExt, ejsPathName, pathname);
            } else {
              console.log(
                chalk.yellow(`[!]The ejs file(${ejsPathName}) does not exist!`)
              );
            }
          } catch (e) {
            console.log(
              chalk.yellow(`[!]Read ejs file(${ejsPathName}) error!`)
            );
          }

          // 读取文件后的处理
        },
        function() {
          // console.log('xxx文件目录遍历完了')
        }
      );
      // ejsExec(basePath, "index.ejs", "index.data.json");
    } else {
      console.log(chalk.red(`[×]${newPath} is exists!`));
    }
  } catch (e) {
    console.dir(e);
  }
}

module.exports = build;
