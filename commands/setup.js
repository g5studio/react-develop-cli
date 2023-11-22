const FileHelper = require("../utilities/helpers/file.helper");

function resolveSetupAction(type, value) {
  FileHelper.readFile("toolbox-config.js", process.env.root)
    .then((data) => {
      FileHelper.generateFile(
        "toolbox-config.json",
        JSON.stringify({
          ...data,
          ...{
            [type]: value,
          },
        }),
        process.env.root
      );
    })
    .catch((error) => {
      if (/no such file or directory/.test(error)) {
        FileHelper.generateFile(
          "toolbox-config.json",
          JSON.stringify({
            [type]: value,
          }),
          process.env.root
        );
      }
    });
}

module.exports = { resolveSetupAction };
