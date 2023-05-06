const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const { stdin, stdout } = process;

fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
  console.log('Файл успешно создан!');
});

stdout.write('Приветствую!\nВведите текст для добавления в файл.\nДля выхода введите `exit` без кавычек.\n');
stdin.on('data', data => {
  const input = data.toString().trim();
  if (input === 'exit') {
    stdout.write('Программа завершена.\nВсего доброго!');
    process.exit();
  }
  fs.appendFile(
    filePath, 
    `${input}\n`,
    err => {
      if (err) throw err;
    }
  );
  stdout.write('Текст добавлен.\nВведите следующий текст для добавления в файл.\nДля выхода из программы введите `exit` без кавычек.\n');
});

process.on('SIGINT', () => {
  stdout.write('\nПрограмма завершена.\nВсего доброго!');
  process.exit();
});