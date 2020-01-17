const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");

async function mapDir(dir, callback, finish) {
  let fileList = [];
  let files;
  try {
    files = await fs.readdir(dir);
  } catch (e) {
    console.log(e);
    return false;
  }
  files.forEach(async (filename, index) => {
    let pathname = path.join(dir, filename);
    // console.log(pathname)
    let stats;
    try {
      // console.log(pathname)
      stats = await fs.stat(pathname);
      if (stats.isDirectory()) {
        await mapDir(pathname, callback, finish);
      } else if (stats.isFile()) {
        fileList.push(pathname);
        // console.log(pathname);
      }
    } catch (e) {
      console.log(e);
      console.log(chalk.red("[×]Get file stats error!"));
      return;
    }
    return fileList;
  });

  /*
  fs.readdir(dir, function(err, files) {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((filename, index) => {
      let pathname = path.join(dir, filename);
      fs.stat(pathname, (err, stats) => {
        // 读取文件信息
        if (err) {
          console.log(chalk.red("[×]Get file stats error!"));
          return;
        }
        if (stats.isDirectory()) {
          mapDir(pathname, callback, finish);
        } else if (stats.isFile()) {
          fs.readFile(pathname, (err, data) => {
            if (err) {
              console.log(chalk.red(err));
              return;
            }
            callback && callback(pathname, data);
            fileList.push(pathname)
          });
        }
      });
      if (index === files.length - 1) {
        finish && finish(fileList);
      }
    });
  });
  */
}

module.exports = mapDir;
