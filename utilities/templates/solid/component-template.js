/**
 * 生成solid框架元件模板
 * @param {string} name camel name
 * @param {string} styleName 樣式檔案名稱，不傳則不生成樣式
 * @default 'style.scss'
 * @param {string} isPage 是否為頁面元件
 * @param {boolean} styleModule 是否為scss模組
 * @returns 元件模板
 */
const getTemplate = ({ name, styleName, isPage, styleModule }) => {
  const FileImport = `${
    isPage
      ? "import ContentLayout from '@shared/components/ContentLayout';\n"
      : "import { IBaseComponentProps } from '@shared/interfaces/base-component.interface';\n\n"
  }${
    styleName
      ? `import ${styleModule ? "style from" : " "}'./${styleName}';\n\n`
      : ""
  }interface Props ${isPage ? "" : "extends IBaseComponentProps"} {\n}\n`;
  const ComponentTemplate = isPage
    ? `const ${name} = (props: Props) => (<ContentLayout testId="${name}">${name} Worked!</ContentLayout>);`
    : `const ${name} = ({ testId }: Props) => (<div data-testid = {testId}>${name} Worked!</div>);`;
  return `${FileImport}\n${ComponentTemplate}\nexport default ${name};`;
};

module.exports = getTemplate;
