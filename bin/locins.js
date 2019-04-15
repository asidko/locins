#!/usr/bin/env node

const [, , ...args] = process.argv;

const getLocaleFilesInfo = require('../index');
const colors = require('colors');
const promptly = require('promptly');
const fs = require('fs-extra');

const equalLangKeys = [
    ["uk", "ua"]
];

(async () => {
    const dirToSearch = process.cwd();
    console.log("Searching for i18n in " + dirToSearch);

    const localeKey = await promptly.prompt(`Locale ${colors.green('key')}: `);

    getLocaleFilesInfo({localeKey, dirToSearch})
        .then(async fileInfos => {
            const localeValueMap = new Map();

            for (const info of fileInfos) {
                const localeValue = localeValueMap.has(info.lang)
                    ? localeValueMap.get(info.lang)
                    : await promptly.prompt(`Locale value for ${colors.yellow(info.lang.toUpperCase())}: `);

                info.localeValue = localeValue.trim();

                localeValueMap.set(info.lang, localeValue);
                equalLangKeys
                    .filter(keys => keys.includes(info.lang))
                    .forEach(keys => keys.forEach(key => localeValueMap.set(key, localeValue)));
            }

            return fileInfos;
        })
        .then(async fileInfos => {
            for (const info of fileInfos) {
                const localeFileLines = fs.readFileSync(info.filePath, 'utf8').split('\n');

                const localeRecord = localeKey + '=' + info.localeValue;
                localeFileLines.splice(info.lineToInsertIndex, 0, localeRecord);

                const localeFileLinesUpdatedText = localeFileLines.join('\n');
                fs.writeFileSync(info.filePath, localeFileLinesUpdatedText);
                console.log(`Appended to ${info.filePath} on line ${info.lineToInsertIndex + 1}`)
            }
        })
        .catch(err => {
            console.log("Rejected.")
        });
})();