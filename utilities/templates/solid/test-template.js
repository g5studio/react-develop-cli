/**
 * 生成solid框架unit test模板
 * @param {string} name camel name
 * @param {boolean} isPage 是否為頁面元件
 * @param {'jest' | 'vitest'} testTool 測試工具
 * @returns test模板
 */
const getTemplate = ({ name, isPage, testTool }) => {
  const TestLibrary = `${
    testTool === "vitest"
      ? "import { describe, it, expect } from 'vitest';\n"
      : ""
  }${
    isPage && "import { Router } from '@solidjs/router';\n"
  }import { render, screen } from '@solidjs/testing-library';`;
  const TestTarget = `import ${isPage ? "Page" : "Component"} from '.';`;
  const BaseUITest = `it('Should render',() => {render(() => ${
    isPage && "<Router>"
  }<${isPage ? "Page" : `Component testId = "${name}"`} />${
    isPage && "</Router>"
  }\n);expect(screen.getByTestId('${name}')).not.toBeNull();\n});`;

  return `${TestLibrary}\n\n${TestTarget}\n\ndescribe('UI test', () => {\n${BaseUITest}\n });`;
};

module.exports = getTemplate;
