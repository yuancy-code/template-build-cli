#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ejsExec = require("./ejs");
const mapDir = require("./map-dir");
const timeFormat = require("../utils/time");
const randomString =require('../utils/string');

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
  let relativePath = output;
  if (path.isAbsolute(output)) {
    newPath = output;
    relativePath = output;
  }
  let randomDir = `${dirBaseName}_${timeFormat(new Date(), "yyyy_mm_dd_hh_MM_ss")}_${randomString(4)}`;
  return {
    absolute: path.join(newPath, "output", randomDir),
    relative: path.join(relativePath, "output", randomDir)
  };
}

/**
 * 开始构建
 * @param {Object} options 配置
 */
async function build(options) {
  let outputDir = options.output;
  let execPath = process.cwd(); // 当前目录
  // let dirBaseName = path.basename(execPath); // 当前文件夹名称
  let { absolute: newPath, relative: newPathRelative } = getNewPath(
    execPath,
    outputDir
  );

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
      // 遍历文件夹
      let paths = await mapDir(newPath);
      let execList = [];
      for (let i = 0; i < paths.length; i++) {
        let pathname = paths[i];
        let extname = path.extname(pathname);
        if (extname !== ".json") {
          continue;
        }
        let pathNameUnExt = pathname.replace(/(.*)\.json$/g, function($1, $2) {
          return $2;
        });
        let ejsPathName = `${pathNameUnExt}.ejs`;
        let hasEjs = null;
        try {
          hasEjs = await fs.exists(ejsPathName);
          if (hasEjs) {
            execList.push(ejsExec(pathNameUnExt, ejsPathName, pathname));
          } else {
            console.log(
              chalk.yellow(`[!]The ejs file(${ejsPathName}) does not exist!`)
            );
          }
        } catch (e) {
          console.log(chalk.yellow(`[!]Read ejs file(${ejsPathName}) error!`));
        }
      }
      // 全部执行
      Promise.all(execList)
        .then(rs => {
          console.log(chalk.green(`View compiled files:\r\ncd ${newPathRelative}`));
        })
        .catch(e => {
          console.log(chalk.red(e.message));
        });
      // ejsExec(basePath, "index.ejs", "index.data.json");
    } else {
      console.log(chalk.red(`[×]${newPath} is exists!`));
    }
  } catch (e) {
    console.dir(e);
  }
}

module.exports = build;
