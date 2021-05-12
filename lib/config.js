const fse = require('fs-extra')
const path = require('path')

const jsonConfig = {
    "name": "custom-lib",
    "mirror":"https://github.com/wuhao5436/bbb.git"
}

// 拼接config.json 路径


const configPath = path.resolve(__dirname, '../config.json');

async function defConfig() {
    try {
        await fse.outputJson(configPath, jsonConfig)
    } catch(err) {
        console.error(err);
        process.exit();
    }
}

module.exports = defConfig;