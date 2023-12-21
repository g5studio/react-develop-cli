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
  const ComponentFileImport = `import { IBaseComponentProps } from '@shared/interfaces/base-component.interface';\n\n${
    styleName
      ? `import ${styleModule ? "style from" : " "}'./${styleName}';\n\n`
      : ""
  }interface I${name}Props extends IBaseComponentProps {\n}\n`;
  const PageFileImport = `import ContentLayout from '@shared/components/ContentLayout';\n${
    styleName
      ? `import ${styleModule ? "style from" : " "}'./${styleName}';\n\n`
      : ""
  }\n`;
  const PageTemplate = `const ${name} = () => (<ContentLayout testId="${name}">${name} Worked!</ContentLayout>);`;
  const ComponentTemplate = `const ${name} = (props: I${name}Props) => (<div data-testid = {props.testId}  classList={props.classList}  class={props.classes}>${name} Worked!</div>);`;
  return `${isPage ? PageFileImport : ComponentFileImport}\n${
    isPage ? PageTemplate : ComponentTemplate
  }\nexport default ${name};`;
};

module.exports = getTemplate;
