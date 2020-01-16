#!/usr/bin/env node

let program = require("commander");
let initCmd = require("./bin/init/index");
let buildCmd = require("./bin/build/index");
program.version("0.0.2");
/**
 * 创建模板
 */
program
  .command("init")
  .alias("i")
  .description("Create a new template")
  .action(function(options) {
    initCmd(options);
  })
  .on("--help", function() {
    console.log("");
    console.log("Examples:");
    console.log("");
    console.log("  $ tb init");
  });

/**
 * 编译模板
 */
program
  .command("build")
  .alias("b")
  .description("Build the template")
  .option("-o, --output <output>", "Specify output directory", "../")
  .action(function(options) {
    buildCmd(options);
  })
  .on("--help", function() {
    console.log("");
    console.log("Examples:");
    console.log("");
    console.log("  $ tb build");
    console.log("  $ tb build -o ../../");
    console.log("  $ tb build -o /Users/yuan/documents/code");
  });

program.parse(process.argv);
