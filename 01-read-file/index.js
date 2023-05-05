const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath, 'utf-8');

let data = '';

stream.on('error', error => console.log('Error', error.message));
stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log('End', data));