fs = require('fs');
const FormatHelper = require('./heplers/format.helper');

function resolveGenerateAction(type, name, { endpoint, model, path, style }) {
    switch (type) {
        case 'c': createComponent(name, { model, path, style }); break;
        case 'm': createModule(name); break;
        case 'model': createModel(name); break;
    }
}

/**
 * 於指定路徑建立元件
 * @param {string} name 元件名稱須符合串烤規則
 * @param {boolean} model 是否於生成對應模型
 * @param {string} path 元件指定路徑，默認當前目錄
 */
function createComponent(name, { model, path, style }) {
    if (model) { createModel(name); }
    const ComponentCamelName = FormatHelper.formatKebabToCamel(name);
    const IsPage = /Page$/.test(ComponentCamelName);
    const FileImport = `${IsPage ? "import ContentLayout from '@shared/components/ContentLayout';\n" : ''}${style ? "import './style.scss';" : ""}\ninterface Props {\n}`;
    const ComponentTemplate = IsPage ?
        `const ${ComponentCamelName} = (props: Props) => (<ContentLayout title="${ComponentCamelName}">${ComponentCamelName} Worked!</ContentLayout>);` :
        `const ${ComponentCamelName} = (props: Props) => (<div>${ComponentCamelName} Worked!</div>);`;
    createFolder(ComponentCamelName, path).then(root => {
        if (style) {
            generateFile(`style.scss`, '@import "~styles";', root);
        }
        generateFile(`index.tsx`, `${FileImport}\n${ComponentTemplate}\nexport default ${ComponentCamelName};`, root);
    });
}

/**
 * 於當前models子目錄生成模型檔案
 * @param {string} name model name
 */
function createModel(name) {
    const UpperCamelCase = FormatHelper.formatKebabToCamel(name);
    const generateModel = () => generateFile(`${name}.model.ts`, `
interface I${UpperCamelCase} {

}

/**
 * @description explan what this model doing here
 * @implements I${UpperCamelCase}
 */ 
export class ${UpperCamelCase} implements I${UpperCamelCase} {
    constructor({ ...args }: object) {
        Object.assign(this, args);
    }
}
`, 'models');
    fs.readdir('models', (error, files) => {
        if (!files) {
            createFolder('models').then(() => generateModel());
        } else {
            generateModel();
        }
    });
}

function createModule(moduleName) {
    const BaseModuleFolder = ['components', 'models', 'constants', 'enums', 'hooks', 'interfaces', 'pages'];
    createFolder(moduleName);
    BaseModuleFolder.forEach(folderName => {
        fs.readdir(folderName, (error, files) => {
            if (!files) {
                createFolder(folderName, moduleName);
            }
        });
    });
}

/**
 * 建立目錄
 * @param {string} folderName 目錄名稱
 * @param {string} root 目錄路徑
 */
function createFolder(folderName, root) {
    const Path = `${root || '.'}/${folderName}`;
    return new Promise((resolve, reject) => {
        fs.mkdir(Path, error => {
            console.log(error || folderName + ' has generated');
            error ? reject(error) : resolve(Path);
        });
    });
}

/** 
 * 於指定路徑生成指定檔案
 * @param {string} fileName 檔案名稱
 * @param {string} content 檔案內容 
 * @param {string} root 檔案路徑
 */
function generateFile(fileName, content, root = '.') {
    fs.writeFile(`${root}/${fileName}`, content, error => console.log(error || fileName + ' has generated'));
}

module.exports = { resolveGenerateAction };