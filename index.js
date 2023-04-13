#!/usr/bin/env node

const { program } = require('commander');
const { resolveGenerateAction } = require('./generate');

program
  .name('g5-developer-cli')
  .description('CLI to some JavaScript string utilities')
  .version('0.0.4');

program.command('g')
  .description('generate')
  .argument('<type>', `
    m - module
    c - component
    model - model
  `)
  .argument('<name>')
  .option('-p, --path <pathName>', 'specific path', '.')
  .option('--style', 'auto create style.scss')
  .option('--model', 'add default model into "models" subfolder')
  .action((type, name, options) => resolveGenerateAction(type, name, options));

program.parse();

