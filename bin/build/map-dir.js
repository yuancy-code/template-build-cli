/*
 * @Author: yuanchengyong 
 * @Date: 2020-01-19 16:48:30 
 * @Last Modified by: zyycy_love@126.com
 * @Last Modified time: 2020-01-19 16:58:11
 * @Des 遍历文件
 */
const path = require("path");
const fs = require("fs");
function mapDir(dir) {
  let fileList = [];
  function getFileList(dir) {
    let files = fs.readdirSync(dir);
    files.forEach((filename) => {
      let pathname = path.join(dir, filename);
      let stats = fs.statSync(pathname);
      if (stats.isDirectory()) {
        getFileList(pathname);
      } else if (stats.isFile()) {
        fileList.push(pathname);
      }
    });
  }
  getFileList(dir);
  return fileList;
}

module.exports = mapDir;
