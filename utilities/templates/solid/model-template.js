/**
 * solid reactive model template
 * @param {*} name camel case name
 */
const getTemplate = (name) => {
  const FileImportTemplate =
    "import { IBaseModel } from '@shared/interfaces/base-model.interface';\nimport { createStore, reconcile } from 'solid-js/store';";
  const SchemaTemplate = `
  type ${name} = {\n// TODO design your model meta data here , please remove this line before commit \n};
  export interface I${name} extends IBaseModel<unknown, ${name}> {}
  `;
  const RelativeModelTemplate = `
  export const get${name} = (): I${name} => {
    const initialData = (): ${name} => ({} as ${name});
    const [metaData, setData] = createStore<${name}>(initialData());

    // !no need to change
    const updateData = (data: Partial<${name}>) => {
      setData(data);
      return metaData;
    };
  
    // !no need to change
    const reset = () => {
      setData(reconcile(initialData()));
    };
  
    // TODO mapping your api data here , you should reassign the value event if the field name are the same between api schema and model interface , please remove this line before commit 
    const initialize = (apiResponse: unknown) => {
      updateData({});
    };
  
    return { metaData, updateData, initialize, reset };
  };
  
  `;
  return `${FileImportTemplate}\n\n${SchemaTemplate}\n\n${RelativeModelTemplate}`;
};

module.exports = getTemplate;
