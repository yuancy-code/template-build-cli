#!/usr/bin/env node

const path = require("path");
const ejs = require("ejs");
const fsExtra = require("fs-extra");
const read = require("fs").readFileSync;
const chalk = require("chalk");

async function remove(ejsPath, dataPath) {
  let rmEjs = fsExtra.remove(ejsPath);
  let rmData = fsExtra.remove(dataPath);
  return Promise.all([rmEjs, rmData])
    .then(result => {
    //   console.log(result);
      let hasErr = false;
      result.map(item => {
        if (item) {
          hasErr = true;
        }
      });
      return Promise.resolve(hasErr);
    })
    .catch(e => {
      return Promise.reject(e);
    });
}
async function exec(basePath, ejsPath, dataPath) {
  let ejsFullPath = ejsPath;
  let dataFullPath = dataPath;
  let ejsString = read(ejsFullPath, "utf8");
  let dataString = read(dataFullPath, "utf8");
  let jsxPath = `${basePath}.jsx`;
  let data = {};
  try {
    data = JSON.parse(dataString);
  } catch (e) {
    console.log(chalk.yellow("[!]Template data conversion error!"));
  }
  //   console.log(data);
  let ret = ejs.compile(ejsString, { filename: dataPath })(data);
  let writeErr = true;
  try {
    writeErr = await fsExtra.writeFile(jsxPath, ret);
  } catch (e) {
    console.log(e);
  }
  if (writeErr) {
    console.log(chalk.yellow("[!]File write error!"));
    return false;
  }
  let removeErr = true;
  try {
    removeErr = await remove(ejsFullPath, dataFullPath);
  } catch (e) {
    console.log(e);
  }
  if (removeErr) {
    console.log(chalk.yellow("[!]File remove error!"));
    return false;
  }
  console.log(chalk.green(`[√]Build template(${ejsFullPath}) success!`));
}
module.exports = exec;
