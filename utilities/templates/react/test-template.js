/**
 * 生成react框架unit test模板
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
  }import { render, screen } from '@testing-library/react';`;
  const TestTarget = `import ${isPage ? "Page" : "Component"} from '.';`;
  const BaseUITest = `it('Should render',() => {render(<${
    isPage ? "Page" : `Component testId = "${name}"`
  } />\n);expect(screen.getByTestId('${name}')).not.toBeNull();\n});`;

  return `${TestLibrary}\n\n${TestTarget}\n\ndescribe('UI test', () => {\n${BaseUITest}\n });`;
};

module.exports = getTemplate;
