const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

const copyDir = async () => {
  try {
    const copyFiles = await fs.readdir(copyFolderPath);
    for (const file of copyFiles) {
      await fs.unlink(path.join(copyFolderPath, file));
    }
    const sourceFiles = await fs.readdir(folderPath);
    for (const file of sourceFiles) {
      const FilePath = path.join(folderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);
      await fs.copyFile(FilePath, copyFilePath);
    }
  } catch (err) {
    console.error(err);
  }
};

fs.mkdir(copyFolderPath, { recursive: true })
  .then(() => copyDir())
  .catch(err => {
    console.error(err);
  });