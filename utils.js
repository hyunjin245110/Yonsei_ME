let mainFile = process.argv[1];
if (!mainFile.endsWith('.js'))
    mainFile += '/index.js';

export const isMain = url => {
    const { pathname } = new URL(url);
    return mainFile === pathname;
};

//isMain(import.meta.url);
