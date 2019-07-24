# Locale Insert

If you have a multilingual project, you have probably come across the fact that adding translations for messages is very tiring, because you need to manually open each language file and look for a suitable place to insert a line with the translation. This small utility will help you with this. Simply enter the key for the new translation and it will prompt you to enter a value for each language, then it will automatically insert the records in the most suitable place in the file.

## Installing

Install __locins__ util globally via npm

```npm install -g locins```

## How to use

1. Open a console in any parent directory that contains __i18n__ folder.
2. Type ```locins``` and press enter.
3. Locins will analyze available localization files and ask you to enter corresponding values.

![image](https://user-images.githubusercontent.com/22843881/56136291-2a8d8c80-5f9b-11e9-94f4-4a7bd0198412.png)
