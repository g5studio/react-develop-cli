#!/usr/bin/env node

const { program } = require("commander");
const { resolveGenerateAction } = require("./commands/generate");
const { resolveSetupAction } = require("./commands/setup");
process.env["root"] = `../${process
  .cwd()
  .split("src")[1]
  ?.replace(/[\w|-]+/g, "..")
  .replace(/^\//, "")}`;

program
  .name("g5-toolbox-cli")
  .description("CLI for quick build g5 pattern project")
  .version("1.0.5");

program
  .command("set")
  .description("set up config", "framework - support framework")
  .arguments("<key> <value>")
  .action((key, value) => resolveSetupAction(key, value));

program
  .command("g")
  .description("generate")
  .argument(
    "<type>",
    `
    m - module
    c - component
    model - model
  `
  )
  .argument("<name>")
  .option("--test", "auto create test.ts")
  .option("-p, --path <pathName>", "specific path", ".")
  .option("--style", "auto create style.scss")
  .option("--model", 'add default model into "models" subfolder')
  .action((type, name, options) => resolveGenerateAction(type, name, options));

program.parse();
