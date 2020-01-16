# Template-Build

基于 ejs 模板的快速编译命令行工具

## 描述

可通过该工具创建并编译基于 ejs 模板的文档

- 编译依据*.ejs 和*.json 同名策略
- 可配置编译输出目录（默认../）

## 安装

```bash
$ npm install template-build-cli -g
```

## 创建模板

```bash
$ tb init
```

## 编译编译

```bash
$ tb build
$ tb build -o ../../
$ tb build -o /Users/yuan/documents/code
```

## License

Licensed under the Apache License, Version 2.0
(<http://www.apache.org/licenses/LICENSE-2.0>)
