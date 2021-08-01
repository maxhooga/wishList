const pug = require('pug');
const sass = require('sass');
const fs = require('fs');
const path = require('path');

// У нас есть папка в которую мы складываем генерируемые HTML файлы
// А также есть папка в которой лежат все наши исходные файлы, например pages/product.pug
// https://nodejs.org/api/path.html#path_path_resolve_paths
// path.resolve - возвращает абсолютный путь к файлу или папке
const PAGES_FOLDER = path.resolve('src', 'pages');
const DIST_FOLDER = path.resolve('dist');
// Данный флаг лучше вынести в переменную
const PRETTY_FLAG = true;

// Создаем папку для генируемых файлов HTML
// Если папка существует  - ничего не делаем
// https://nodejs.org/api/fs.html#fs_fs_existssync_path
if (!fs.existsSync(DIST_FOLDER)) {
    // https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options
    fs.mkdirSync(DIST_FOLDER);
}

const errorHandler = (filename, filePath) => (err) => {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log(`File ${filename} was write at ${filePath}`);
    }
};

// Выбираем все файлы из папки куда надо складывать HTML файлы
// https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options
const files = fs.readdirSync(PAGES_FOLDER);

//
const result = sass.renderSync({
    file: 'src/style/input.scss',
    sourceMap: true,
    outFile: 'output.css'
});
fs.writeFileSync(
    'src/output.css',
    result.css.toString()
);
//

files.forEach((originalFilename) => {
    // Удаляем расширение файла из имени файла
    // Разбиваем название файла по точкам
    // Например product.template.pug => ['product', 'template', 'pug']
    const chunks = originalFilename.split('.');
    // Если файл не имеет разрешения pug
    // То ничего не делать и завершить выполнение.
    if (chunks[chunks.length - 1] !== 'pug') return;
    // Соединяем название файла точками, за исключением последнего элемента ([...].join(...))
    // ['product', 'template', 'pug'] => product.template.html
    const targetFilename = `${chunks.slice(0, chunks.length - 1).join('.')}.html`;
    // Сгеренируем пути до original и target файлов
    // https://nodejs.org/api/path.html#path_path_join_paths
    // path.join - просто соединяем элементы массива в путь к файлв или папке
    const originalFilePath = path.join(PAGES_FOLDER, originalFilename);
    const targetFilePath = path.join(DIST_FOLDER, targetFilename);

    fs.writeFile(
        targetFilePath,
        pug.renderFile(originalFilePath, { pretty: PRETTY_FLAG }),
        errorHandler(originalFilename, targetFilePath)
    );
});

// fs.writeFile(
//   'outputHTML.html',
//   pug.renderFile('product.pug', { pretty: PRETTY_FLAG }),
//   errorHandler
// )
