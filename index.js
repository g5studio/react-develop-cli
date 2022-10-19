#!/usr/bin/env node

const { program } = require('commander');
fs = require('fs');

program
  .name('vanilla-cli')
  .description('CLI to some JavaScript string utilities')
  .version('0.0.1');

program.command('g')
  .description('generate')
  .argument('<type>', `
    m - module
    a - api
  `)
  .argument('<name>')
  .option('-ep, --endpoint <endpointName>', 'api repo endpoint', 'saffron')
  .action((type, name, options) => {
    resolveGenerateAction(type, name, options);
  });

program.parse();

function resolveGenerateAction(type, name, { endpoint }) {
  switch (type) {
    case 'm': createModule(name); break;
    case 'a': createApiRepo(name, endpoint); break;
  }
}

function createApiRepo(repoName, endpoint) {
  console.log(endpoint)
  createFolder(repoName);
  const ApiSchema = `${repoName}-${endpoint}.interface`;
  generateFile('index.ts', `
  import defHttp from '@utilities/apis/${endpoint}/defHttp';
  import { getApiBaseUrl } from '@utilities/apis/utils';
  import { AxiosRequestConfig } from 'axios';
  import * as Schema from './${ApiSchema}';

  export * from './${ApiSchema}';
  const repo = '${repoName}';
  `, repoName);
  generateFile(`${ApiSchema}.ts`,
    `import { IBasicApiData } from '@shared/interfaces/api.interface';`,
    repoName);
}

function createModule(moduleName) {
  const BaseModuleFolder = ['components', 'models', 'constants', 'enums', 'hooks', 'interfaces', 'pages'];
  createFolder(moduleName);
  BaseModuleFolder.forEach(folderName => createFolder(folderName, moduleName));
}

function createFolder(folderName, root = '.') {
  fs.mkdir(`${root}/${folderName}`, err => console.log(err || folderName + ' has generated'));
}

function generateFile(fileName, content, root = '.') {
  fs.writeFile(`${root}/${fileName}`, content, err => console.log(err || fileName + ' has generated'));
}