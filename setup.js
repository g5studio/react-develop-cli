const FileHelper = require("./utilities/helpers/file.helper");

function resolveSetupAction(type, value) {
  FileHelper.readFile("toolbox-config.js")
    .then((data) => {
      FileHelper.generateFile(
        "toolbox-config.json",
        JSON.stringify({
          ...data,
          ...{
            [type]: value,
          },
        })
      );
    })
    .catch((error) => {
      if (/no such file or directory/.test(error)) {
        FileHelper.generateFile(
          "toolbox-config.json",
          JSON.stringify({
            [type]: value,
          })
        );
      }
    });
}

module.exports = { resolveSetupAction };
