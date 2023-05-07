const fs = require('fs/promises');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
const copyAssetsPath = path.join(projectPath, 'assets');
const assetsPath = path.join(__dirname, 'assets');

fs.mkdir(projectPath, { recursive: true })
  .catch(err => {
    console.error(err);
  });

const copyDir = async (sourceDir, destDir) => {
  try {
    await fs.mkdir(destDir, { recursive: true });
    const files = await fs.readdir(sourceDir);
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      const stat = await fs.stat(sourcePath);
      if (stat.isFile()) {
        await fs.copyFile(sourcePath, destPath);
      } else if (stat.isDirectory()) {
        await copyDir(sourcePath, destPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const htmlPath = path.join(projectPath, 'index.html');

const replaceTags = async () => {
  try {
    const componentFiles = await fs.readdir(componentsPath);
    const components = {};
    await Promise.all(componentFiles.map(async (file) => {
      const componentName = path.parse(file).name;
      const componentPath = path.join(componentsPath, file);
      const content = await fs.readFile(componentPath, 'utf8');
      components[componentName] = content;
    }));
    const template = await fs.readFile(templatePath, 'utf8');
    const replaced = template.replace(/\{\{(.+?)\}\}/g, (match, tag) => {
      return components[tag] || '';
    });
    await fs.writeFile(htmlPath, replaced, 'utf8');
  } catch (err) {
    console.error(err);
  }
};

const stylesPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(projectPath, 'style.css');

let stylesData = '';

const mergeStyles = async () => {
  try {
    const files = await fs.readdir(stylesPath, { withFileTypes: true });
    const cssFiles = [];
    files.forEach(file => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesPath, file.name);
        cssFiles.push(fs.readFile(filePath, 'utf-8'));
      }
    });
    const data = await Promise.all(cssFiles);
    stylesData = data.join('');
    await fs.writeFile(bundleFilePath, stylesData);
  } catch (err) {
    console.error(err);
  }
};

fs.mkdir(copyAssetsPath, { recursive: true })
  .then(() => copyDir(assetsPath, copyAssetsPath))
  .then(() => replaceTags())
  .then(() => mergeStyles())
  .catch(err => {
    console.error(err);
  });