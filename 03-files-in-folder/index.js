const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true })
  .then(files => {
    console.log('Список файлов в папке:');
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const { name, ext } = path.parse(filePath);
        fs.stat(filePath)
          .then(stats => {
            console.log(`${name} - ${ext.slice(1)} - (${stats.size} байт)`);
          })
          .catch(err => {
            console.error(err);
          });
      }
    });
  })
  .catch(err => {
    console.error(err);
  });