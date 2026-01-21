#!/usr/bin/env node

const program = require('commander')

// 请求升级
const updateChk = require('../lib/update')

// 请求mirror
const setMirror = require('../lib/mirror');

// 请求template download
const dlTemplate = require('../lib/download');

// init
const initProject = require('../lib/init');

// 从package.json中请求version字段
program.version(require('../package.json').version,'-v, --version')

// upgrade 监测更新

program.command('upgrade')
       .description('check the lib-creater version')
       .action(() => {
           // 执行 lib/update.js 里面的操作
           updateChk()
       })

// mirror 切换镜像连接
program
       .command('mirror <template_mirror>')
       .description('set the template mirror.')
       .action((tplMirror) => {
            setMirror(tplMirror)
       })

program 
       .command('template')
       .description('Download template from mirror')
       .action(() => {
           dlTemplate()
       })


program
       .name('lib-creater')
       .usage('<commands> [options]')
       .command('init <project_name>')
       .description('Create a React component library project.')
       .option('-t, --template <name>', 'template name (default: react-ts)', 'react-ts')
       .option('-p, --package-name <name>', 'package name in package.json')
       .action((project, options) => {
              initProject(project, options)
       })

// 解析命令行参数
program.parse(process.argv);
