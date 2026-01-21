const fse = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
// const fs = require('fs')
const symbols = require('log-symbols')
// 用于控制台交互
const inquirer = require('inquirer')
// 用于替换模板字符串
const handlebar = require('handlebars')

const path = require('path')

const dlTemplate = require('./download')

const PACKAGE_NAME = 'packageName';

const TEMPLATE_MAP = {
    'react-ts': 'react-ts',
};

async function initProject(projectName, options = {}) {
    try {
        const exists = await fse.pathExists(projectName);
        if (exists) {
             // 项目重名时提醒用户
             console.log(symbols.error, chalk.red('the project already exists'))
        } else {
            const selectedTemplate = (options.template || 'react-ts').trim();

            if (!TEMPLATE_MAP[selectedTemplate]) {
                console.log(
                    symbols.error,
                    chalk.red(`unknown template "${selectedTemplate}". available: ${Object.keys(TEMPLATE_MAP).join(', ')}`)
                )
                return;
            }

            const questions = [];

            if (!options.packageName) {
                questions.push({
                    type: 'input',
                    name: PACKAGE_NAME,
                    message: 'what is your packageName?',
                    default: 'my-custom-lib'
                });
            }

            const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};
            const packageName = options.packageName || answers[PACKAGE_NAME];

            // spinner 初始化
            const initSpinner = ora(chalk.cyan(`creating ${packageName} ...`))
            // 开始执行等待动画
            initSpinner.start();

            // 拼接template 文件夹路径
            const templatePath = path.resolve(__dirname, `../template/${TEMPLATE_MAP[selectedTemplate]}`)

            // 返回 node.js 的当前工作目录
            const processPath = process.cwd()

            // 把项目转小写
            const LCProjectName = projectName.toLowerCase();

            // 拼接完整路径
            const targetPath = `${processPath}/${LCProjectName}`;

            // 判断路径是否存在
            const templateExists = await fse.pathExists(templatePath);

            // 如果不存在先下载模板
            if (!templateExists) {
                await dlTemplate()
            }

            // 复制模板到对应的路径中
            try {
                await fse.copy(templatePath, targetPath)
            } catch (error) {
                console.log(symbols.error, chalk.red(`copy template failed. ${error}`))
                process.exit();
            }

            // 把要替换的模板字符串准备好
            const multiMeta = {
                packageName
            }

            // 把要替换的文件准备好
            const multiFiles = [
                `${targetPath}/package.json`,
            ]

            // 用条件循环把模板字符替换到文件去
            for (var i = 0; i < multiFiles.length; i++) {
                try {
                    // 读取文件
                    const multiFilesContent = await fse.readFile(multiFiles[i], 'utf8')
                    // console.log(multiFilesContent)
                    // 替换文件 handlebars.compile(原文件内容)(模板字符)
                    const multiFilesResult = await handlebar.compile(multiFilesContent)(multiMeta)
                    // 等待输入文件
                    await fse.outputFile(multiFiles[i], multiFilesResult)

                } catch (error) {
                    // 如果报错 spinner 提示
                    initSpinner.text = chalk.red(`Initialize project failed. ${error}`)
                    // 终止等待动画并显示 x 标识
                    initSpinner.fail()
                    // 退出进程
                    process.exit()
                }
            }

            // 如果成功 spinner 就改变文字信息
            initSpinner.text = `Initialze ${packageName} module successfully built.`

            initSpinner.succeed();

            let scripts = [];
            try {
                const packageJsonPath = path.join(targetPath, 'package.json');
                const packageJson = await fse.readJson(packageJsonPath);
                scripts = packageJson.scripts ? Object.keys(packageJson.scripts) : [];
            } catch (error) {
                console.log(symbols.warning, chalk.yellow(`read package.json failed: ${error}`))
            }

            const nextSteps = [
                `cd ${chalk.yellow(LCProjectName)}`,
                `${chalk.yellow('npm install')}`
            ];

            if (scripts.includes('dev')) {
                nextSteps.push(`${chalk.yellow('npm run dev')}`)
            }
            if (scripts.includes('build')) {
                nextSteps.push(`${chalk.yellow('npm run build')}`)
            }
            if (scripts.includes('lint')) {
                nextSteps.push(`${chalk.yellow('npm run lint')}`)
            }

            console.log(`
                        next step:
                        ${nextSteps.join('\n                        ')}
                    `)

        }

    } catch (error) {
        if (error.isTtyError) {
            console.log(symbols.error, chalk.red("prompt couldn`t be rendered in current environment."))
        } else {
            console.log(symbols.error, chalk.red(error))
        }
        process.exit();
    }
}

module.exports = initProject;
