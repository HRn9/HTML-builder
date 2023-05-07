const fs = require('fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const projectPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(projectPath, 'bundle.css');

let stylesData = '';

fs.readdir(stylesPath, { withFileTypes: true })
  .then(files => {
    const cssFiles = [];
    files.forEach(file => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesPath, file.name);
        cssFiles.push(fs.readFile(filePath, 'utf-8'));
      }
    });
    return Promise.all(cssFiles);
  })
  .then(data => {
    stylesData = data.join('');
    return fs.writeFile(bundleFilePath, stylesData);
  })
  .catch(err => {
    console.error(err);
  });