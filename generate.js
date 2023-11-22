fs = require("fs");

const FormatHelper = require("./utilities/helpers/format.helper");
const FileHelper = require("./utilities/helpers/file.helper");
const ReactModelGenerator = require(`./utilities/templates/react/model-template`);
const ReactComponentGenerator = require(`./utilities/templates/react/component-template`);
const SolidModelGenerator = require(`./utilities/templates/solid/model-template`);
const SolidComponentGenerator = require(`./utilities/templates/solid/component-template`);

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
 * 於指定路徑建立元件
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
  const { framework, styleModule } = await loadConfig();
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
    if (style) {
      FileHelper.generateFile(
        StyleFileName,
        `@import "~styles/variables";\n.${
          IsPage ? "page" : "component"
        }-${name.replace(/-page$/, "")}{\n}`,
        root
      );
    }
    if (test) {
      const TestTarget = IsPage ? "Page" : "Component";
      const BaseUITest = `it('Should render', async () => {render(<${TestTarget} />\n);expect(screen.getByTestId('${ComponentCamelName}')).not.toBeNull();\n});`;
      FileHelper.generateFile(
        "index.test.tsx",
        `import ${
          IsPage ? "Page" : "Component"
        } from ".";\nimport { render, screen } from "@testing-library/react";\ndescribe('UI test', () => {\n${BaseUITest}\n });\ndescribe('Feature test', () => { });`,
        root
      );
    }
    FileHelper.generateFile(`index.tsx`, ComponentTemplate, root);
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
 *
 * @returns config
 */
async function loadConfig() {
  let config = {
    framework: "react",
    styleModule: false,
  };
  await FileHelper.readFile("toolbox-config.json", process.env.root).then(
    (data) => {
      config = { ...config, ...data };
    }
  );
  return config;
}

module.exports = { resolveGenerateAction };
