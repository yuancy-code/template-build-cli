const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

function mapDir(dir, callback, finish) {
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
          });
        }
      });
      if (index === files.length - 1) {
        finish && finish();
      }
    });
  });
}

module.exports = mapDir;
