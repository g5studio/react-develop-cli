fs = require("fs");

class FileHelper {
  /**
   * 建立目錄
   * @param {string} folderName 目錄名稱
   * @param {string} root 目錄路徑
   */
  static createFolder(folderName, root) {
    const Path = `${root || "."}/${folderName}`;
    return new Promise((resolve, reject) => {
      fs.mkdir(Path, (error) => {
        console.log(error || folderName + " has generated");
        error ? reject(error) : resolve(Path);
      });
    });
  }

  /**
   * 讀取特定檔案並轉換為js內容
   * @param {string} fileName 檔案名稱
   * @param {string} root 檔案路徑
   * @returns {any}
   */
  static readFile(fileName, root = ".") {
    return new Promise((resolve, reject) => {
      fs.readFile(`${root}/${fileName}`, (error, data) => {
        if (!error) {
          resolve(JSON.parse(data));
        } else {
          reject(error);
        }
      });
    });
  }

  /**
   * 於指定路徑生成指定檔案
   * @param {string} fileName 檔案名稱
   * @param {string} content 檔案內容
   * @param {string} root 檔案路徑
   */
  static generateFile(fileName, content, root = ".") {
    fs.writeFile(`${root}/${fileName}`, content, (error) =>
      console.log(error || fileName + " has generated")
    );
  }
}

module.exports = FileHelper;
