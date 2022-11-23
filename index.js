#!/usr/bin/env node

const { program } = require('commander');
const { resolveGenerateAction } = require('./generate');

program
  .name('vanilla-cli')
  .description('CLI to some JavaScript string utilities')
  .version('0.0.3');

program.command('g')
  .description('generate')
  .argument('<type>', `
    m - module
    a - api
    c - component
    model - model
  `)
  .argument('<name>')
  .option('-p, --path <pathName>', 'specific path', '.')
  .option('--style', 'auto create index.module.less', false)
  .option('--model', 'add default model into "models" subfolder')
  .option('-ep, --endpoint <endpointName>', 'api repo endpoint', 'saffron')
  .action((type, name, options) => resolveGenerateAction(type, name, options));

program.parse();

