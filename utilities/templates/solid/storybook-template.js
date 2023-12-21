/**
 * 生成solid框架storybook模板
 * @param {string} name camel name
 * @returns storybook模板
 */
const getTemplate = ({ name }) => {
  const Template = `import type { Meta, StoryObj } from 'storybook-solidjs';

    import Component from './index';
    
    const meta: Meta<typeof Component> = {
      component: Component,
      argTypes: {
        // TODO configure you story dashboard here
      },
    };
    
    export default meta;
    
    type Story = StoryObj<typeof Component>;
    
    /*
     *👇 Render functions are a framework specific feature to allow you control on how the component renders.
     * See https://storybook.js.org/docs/solid/api/csf
     * to learn how to use render functions.
     */
    export const Base${name}Demo: Story = {
      args: {
        // TODO configure your story props here 
      },
    };
    `;

  return Template;
};

module.exports = getTemplate;
