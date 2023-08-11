const getTemplate = (name) => `
interface I${name} {}

/**
 * @description explan what this model doing here
 * @implements I${name}
 */
export class ${name} implements I${name} {
  constructor({ ...args }: object) {
    Object.assign(this, args);
  }
}
`;

module.exports = getTemplate;
