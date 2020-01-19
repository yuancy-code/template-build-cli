/*
 * @Author: yuanchengyong
 * @Date: 2020-01-19 17:21:02
 * @Last Modified by: zyycy_love@126.com
 * @Last Modified time: 2020-01-19 17:25:50
 */

module.exports = function randomString(len) {
  len = len || 32;
  let $chars =
    "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = "";
  for (i = 0; i < len; i++) {
    let pos = 0;
    if (i == 0) {
      pos = 21;
    } else {
      pos = maxPos;
    }
    pwd += $chars.charAt(Math.floor(Math.random() * pos));
  }
  return pwd;
};
