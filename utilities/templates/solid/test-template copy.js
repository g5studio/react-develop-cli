/**
 * 生成solid框架元件模板
 * @param {string} name camel name
 * @param {string} styleName 樣式檔案名稱，不傳則不生成樣式
 * @default 'style.scss'
 * @returns 元件模板
 */
const getTemplate = (name, styleName) => {
  const IsPage = /Page$/.test(name);
  const FileImport = `${
    IsPage
      ? "import ContentLayout from '@shared/components/ContentLayout';\n"
      : ""
  }${style ? `import './${styleName}';` : ""}\ninterface Props {\n}`;
  const ComponentTemplate = IsPage
    ? `const ${name} = (props: Props) => (<ContentLayout testId="${name}">${name} Worked!</ContentLayout>);`
    : `const ${name} = (props: Props) => (<div>${name} Worked!</div>);`;
  return `${FileImport}\n${ComponentTemplate}\nexport default ${name};`;
};

module.exports = getTemplate;
