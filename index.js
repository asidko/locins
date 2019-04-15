const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');

function getLocaleFilesInfo(config) {
    const {dirToSearch = process.cwd(), localeKey} = config;
    return new Promise((resolve, reject) => {
        glob('**/i18n/', {cwd: dirToSearch}, (err, files) => {
            if (files.length === 0) return resolve([]);
            const resultArr = [];

            const localeDir = path.join(dirToSearch, files[0]);
            const localeFiles = fs.readdirSync(localeDir);
            localeFiles.forEach(localeFile => {
                const localeFilePath = path.join(localeDir, localeFile);
                const localeFileLines = fs.readFileSync(localeFilePath, 'utf8').split('\n');
                const localeLang = getLangFromName(localeFile, 'en');

                let bestMatchLineIndex = findBestLineIndexStartsWith(localeFileLines, localeKey);
                if (bestMatchLineIndex < 0) bestMatchLineIndex = localeFileLines.length;

                resultArr.push({
                    fileName: localeFile,
                    filePath: localeFilePath,
                    lang: localeLang,
                    lineToInsertIndex: bestMatchLineIndex + 1
                });
            });

            resolve(resultArr);
        });
    })
}

function findBestLineIndexStartsWith(lines, text) {
    for (let i = 0; i < text.length; i++) {
        text = text.substring(0, text.length - i);
        let resultLineIndex = -1;
        for (let j = 0; j < lines.length; j++) {
            if (lines[j].startsWith(text)) resultLineIndex = j;
        }
        if (resultLineIndex > 0) return resultLineIndex;
    }
    return -1;
}

function getLangFromName(localeFileName, defaultLang) {
    const localeFileLangMatchGroup = (/.+_(\w+)\./).exec(localeFileName);
    return localeFileLangMatchGroup && localeFileLangMatchGroup.length >= 2
        ? localeFileLangMatchGroup[1]
        : defaultLang;
}

module.exports = getLocaleFilesInfo;