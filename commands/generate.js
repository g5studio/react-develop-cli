fs = require("fs");

const FormatHelper = require("../utilities/helpers/format.helper");
const FileHelper = require("../utilities/helpers/file.helper");
const ReactModelGenerator = require(`../utilities/templates/react/model-template`);
const ReactComponentGenerator = require(`../utilities/templates/react/component-template`);
const ReactTestGenerator = require(`../utilities/templates/react/test-template`);
const SolidModelGenerator = require(`../utilities/templates/solid/model-template`);
const SolidComponentGenerator = require(`../utilities/templates/solid/component-template`);
const SolidTestGenerator = require(`../utilities/templates/solid/test-template`);

function resolveGenerateAction(type, name, { test, model, path, style }) {
  switch (type) {
    case "c":
      createComponent(name, { model, path, style, test });
      break;
    case "m":
      createModule(name);
      break;
    case "model":
      createModel(name);
      break;
  }
}

/**
 * 於指定路徑建立元件，並自動註冊到
 * @param {string} name 元件名稱須符合串烤規則
 * @param {boolean} model 是否於生成對應模型
 * @param {string} path 元件指定路徑，默認當前目錄
 * @param {string} style 是否生成樣式檔案
 * @param {string} test 是否生成測試檔案
 */
async function createComponent(name, { model, path, style, test }) {
  if (model) {
    createModel(name);
  }
  const { framework, styleModule, testTool } = await loadConfig();
  const ComponentCamelName = FormatHelper.formatKebabToCamel(name);
  const IsPage = /Page$/.test(ComponentCamelName);
  const StyleFileName = style
    ? `index${styleModule ? ".module" : ""}.scss`
    : "";
  const ComponentTemplate =
    framework === "solid"
      ? SolidComponentGenerator({
          name: ComponentCamelName,
          styleName: StyleFileName,
          isPage: IsPage,
          styleModule,
        })
      : ReactComponentGenerator({
          name: ComponentCamelName,
          styleName: StyleFileName,
          isPage: IsPage,
          styleModule,
        });
  FileHelper.createFolder(ComponentCamelName, path).then((root) => {
    FileHelper.generateFile(`index.tsx`, ComponentTemplate, root);
    if (style) {
      FileHelper.generateFile(
        StyleFileName,
        `// !class for specific component or page should follow BEM rule\n.${
          IsPage ? "page" : "component"
        }-${name.replace(/-page$/, "")}{\n}`,
        root
      );
    }
    if (test) {
      const TestTemplate =
        framework === "solid"
          ? SolidTestGenerator({
              name: ComponentCamelName,
              isPage: IsPage,
              testTool,
            })
          : ReactTestGenerator({
              name: ComponentCamelName,
              isPage: IsPage,
              testTool,
            });
      FileHelper.generateFile("index.test.tsx", TestTemplate, root);
    }
    registerComponent(ComponentCamelName);
  });
}

/**
 * 於當前models子目錄生成模型檔案
 * @param {string} name model name
 */
async function createModel(name) {
  const UpperCamelCase = FormatHelper.formatKebabToCamel(name);
  const { framework } = await loadConfig();
  const template =
    framework === "solid"
      ? SolidModelGenerator(UpperCamelCase)
      : ReactModelGenerator(UpperCamelCase);
  const generateModel = () =>
    FileHelper.generateFile(`${name}.model.ts`, template, "models");
  fs.readdir("models", (error, files) => {
    if (!files) {
      FileHelper.createFolder("models").then(() => generateModel());
    } else {
      generateModel();
    }
  });
}

function createModule(moduleName) {
  const BaseModuleFolder = [
    "components",
    "models",
    "constants",
    "enums",
    "hooks",
    "interfaces",
    "pages",
  ];
  FileHelper.createFolder(moduleName);
  BaseModuleFolder.forEach((folderName) => {
    fs.readdir(folderName, (error, files) => {
      if (!files) {
        FileHelper.createFolder(folderName, moduleName).then((path) => {
          FileHelper.generateFile("index.ts", "", path);
        });
      }
    });
  });
}

/**
 * 載入當前專案配置檔案
 * @returns config
 */
async function loadConfig() {
  let config = {
    framework: "react",
    styleModule: false,
    testTool: "jest",
  };
  await FileHelper.readFile("toolbox-config.json", process.env.root).then(
    (data) => {
      config = { ...config, ...data };
    }
  );
  return config;
}

/**
 * 將元件註冊至母資料夾下index.ts
 * @param name camel name
 */
function registerComponent(name) {
  const exportInfo = `export * from './${name}';`;
  fs.readFile("index.ts", (error, data) => {
    if (!error) {
      FileHelper.generateFile("index.ts", `${data}${exportInfo}`);
    } else {
      FileHelper.generateFile("index.ts", `${data}${exportInfo}`);
    }
  });
}

module.exports = { resolveGenerateAction };