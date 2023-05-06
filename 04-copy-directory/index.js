const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyFolderPath, { recursive: true })
  .catch(err => {
    console.error(err);
  });

fs.readdir(folderPath)
  .then(files => {
    files.forEach(file => {
      const FilePath = path.join(folderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);
      fs.copyFile(FilePath, copyFilePath);
    });
  })
  .catch(err => {
    console.error(err);
  });