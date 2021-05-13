// 用于下载模板
// const download = require('download');
const gitClone = require('git-clone');
const gitRepoClone = require('download-git-repo');

// 用于实现等待动画
const ora = require('ora')
// 请求chalk库 用于实现控制台字符样式
const chalk = require('chalk')
const fse = require('fs-extra')
const path = require('path')


// 读取config
const defConfig = require('./config')

// 拼接 config.json
const cfgPath = path.resolve(__dirname, '../config.json')

// 拼接 template 模板文件完整路径
const tplPath = path.resolve(__dirname, '../template/react-ts')

async function dlTemplate() {
    const exists = await fse.pathExists(cfgPath);
    if (exists) {
      return await dlAction();
    } else {
      await defConfig()
      return await dlAction();
    }
}

async function dlAction () {
    try {
        await fse.remove(tplPath)
    } catch (error) {
        console.log(error)
        process.exit()
    }


    // 读取配置用于获取镜像链接
    const jsonConfig = await fse.readJson(cfgPath)
    // spinner 初始设置
    const dlSpinner = ora(chalk.cyan('Downloading template...'))

    // 开始执行等待动画
    dlSpinner.start()
    return new Promise((resolve, reject) => {
      try {
        gitClone(jsonConfig.mirror, path.resolve(__dirname, '../template/react-ts'), {checkout: 'cli'}, function() {
          // 下载成功
            dlSpinner.text = 'download template success.';
            dlSpinner.succeed();
            resolve();
        })
      } catch (error) {
          //  下载失败时提醒
        dlSpinner.text = chalk.red(`Download template failed. ${error}`)
        // 终止等待动画
        dlSpinner.fail();
        reject();
        process.exit();
      }
    })
}

module.exports = dlTemplate
