#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
var inquirer = require("inquirer");

/**
 * 提问 - 初始化目录
 */
const directoryPrompt = [
  {
    type: "input",
    message: "Please enter the initialization directory:",
    name: "output",
    default: "./" // 默认值
  }
];
/**
 * 提问 - 是否继续
 */
const isContinuePrompt = [
  {
    type: "confirm",
    message: "Continue will overwrite files with the same name",
    name: "output",
    default: "./" // 默认值
  }
];
/**
 * 提问 - 选择模板
 */
const promptDemoList = choices => {
  return [
    {
      type: "list",
      message: "Please select a template:",
      name: "templateName",
      choices,
      pageSize: 6 // 设置行数
    }
  ];
};

/**
 * 拷贝目录
 * @param {String} dir 需要复制的目录
 * @param {String} dirNew 负责后的目录
 */
async function copyFiles(dir, dirNew) {
  console.log(chalk.green("[→]Copy file begin!"));
  try {
    await fs.copy(dir, dirNew);
    console.log(chalk.green("[√]Copy file success!"));
  } catch (err) {
    console.error(chalk.red("[×]Copy file not exists!"));
  }
}
/**
 * 判断是否为空文件夹
 * @param {String} path 文件夹目录
 */
async function isNotEmptyDir(path) {
  let files = await fs.readdir(path);
  return files.length > 0;
}

/**
 * 初始化模板
 * @param {Object} options 配置
 */
async function init(options) {
  let execPath = process.cwd(); // 当前执行目录
  let dirName = __dirname; // 当前文件所在目录
  let demoFullPath = path.join(dirName, "../../demo"); // demo完整目录
  let outputFullPath;
  //   const exists = await fs.pathExists(outputFullPath);

  let directoryAnswers = await inquirer.prompt(directoryPrompt);
  if (!directoryAnswers.output) {
    console.log(chalk.red("[×]Please enter the initialization directory!"));
    return false;
  }
  if (path.isAbsolute(directoryAnswers.output)) {
    outputFullPath = directoryAnswers.output;
  } else {
    outputFullPath = path.join(execPath, directoryAnswers.output); // 输出完成目录
  }

  let isNotEmpty = await isNotEmptyDir(outputFullPath);
  let continueAnswers;
  if (isNotEmpty) {
    console.log(chalk.yellow("[!]The directory is not empty!"));
    continueAnswers = await inquirer.prompt(isContinuePrompt);
  }
  //   console.log(continueAnswers)
  if (continueAnswers && !continueAnswers.output) {
    return false;
  }
  let files = await fs.readdir(demoFullPath);
  if (files.length <= 0) {
    console.log(chalk.yellow("[!]Template file does not exist!"));
    return false;
  }
  let promptDemoListAnswers = await inquirer.prompt(promptDemoList(files));
  let templateName = promptDemoListAnswers.templateName;
  // await inquirer.prompt(promptDemoList);
  await copyFiles(path.join(demoFullPath, templateName), path.join(outputFullPath,templateName));
  console.log(chalk.green(`cd ${templateName} && tb build`))
}

module.exports = init;
