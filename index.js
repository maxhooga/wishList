const pug = require('pug');
const sass = require('sass');
const fs = require('fs');
const path = require('path');

// У нас есть папка в которую мы складываем генерируемые HTML файлы
// А также есть папка в которой лежат все наши исходные файлы, например pages/product.pug
// https://nodejs.org/api/path.html#path_path_resolve_paths
// path.resolve - возвращает абсолютный путь к файлу или папке
const PAGES_FOLDER = path.resolve('src', 'pages');
const STYLES_FOLDER = path.resolve('src', 'style');

const DIST_FOLDER = path.resolve('dist');
const DIST_STYLES_FOLDER = path.resolve(DIST_FOLDER, 'style');
// Данный флаг лучше вынести в переменную
const PRETTY_FLAG = true;

// Создаем папку для генируемых файлов HTML
// Если папка существует  - ничего не делаем
// https://nodejs.org/api/fs.html#fs_fs_existssync_path
if (!fs.existsSync(DIST_FOLDER)) {
    // https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options
    fs.mkdirSync(DIST_FOLDER);
}

// Создаем папку для генируемых файлов css
// Если папка существует  - ничего не делаем
// https://nodejs.org/api/fs.html#fs_fs_existssync_path
if (!fs.existsSync(DIST_STYLES_FOLDER)) {
    // https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options
    fs.mkdirSync(DIST_STYLES_FOLDER);
}

// Удаляем расширение файла из имени файла
// Разбиваем название файла по точкам
// Например product.template.pug => ['product', 'template', 'pug']
const getChunks = (filename) => filename.split('.');
const getExtension = (filename) => getChunks(filename)[getChunks(filename).length - 1];
// Соединяем название файла точками, за исключением последнего элемента ([...].join(...))
// ['product', 'template', 'pug'] => product.template.html
const getFilename = (filename) => getChunks(filename).slice(0, getChunks(filename).length - 1).join('.');

// Выбираем из папки все css файлы
// https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options
const styleFiles = fs.readdirSync(STYLES_FOLDER);

styleFiles.forEach((originalCssFilename) => {
    try {
        const extension = getExtension(originalCssFilename);
        if (extension === 'css') {
            const outFile = path.resolve(DIST_STYLES_FOLDER, originalCssFilename);
            fs.copyFileSync(path.resolve(STYLES_FOLDER, originalCssFilename), outFile);
            console.log(`File ${originalCssFilename} was copied to ${outFile}`);
            return;
        } else if (extension === 'scss') {
            const outFile = path.resolve(DIST_STYLES_FOLDER, `${getFilename(originalCssFilename)}.css`);

            const result = sass.renderSync({
                file: path.resolve(STYLES_FOLDER, originalCssFilename),
                sourceMap: true,
                outFile: outFile
            });
            fs.writeFileSync(
                outFile,
                result.css.toString()
            );
            console.log(`File ${originalCssFilename} was write at ${outFile}`);
            return;
        } else {
            return;
        };
    } catch (err) {
        console.log(err);
    }
});

// const result = sass.renderSync({
//     file: 'src/style/input.scss',
//     sourceMap: true,
//     outFile: 'output.css'
// });
// fs.writeFileSync(
//     'src/output.css',
//     result.css.toString()
// );

// Выбираем все файлы из папки куда надо складывать HTML файлы
// https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options
const files = fs.readdirSync(PAGES_FOLDER);

files.forEach((originalFilename) => {
    try {
        const extension = getExtension(originalFilename);
        if (extension !== 'pug') return;
        const targetFilename = `${getFilename(originalFilename)}.html`;
        // Сгеренируем пути до original и target файлов
        // https://nodejs.org/api/path.html#path_path_join_paths
        // path.join - просто соединяем элементы массива в путь к файлв или папке
        const originalFilePath = path.join(PAGES_FOLDER, originalFilename);
        const targetFilePath = path.join(DIST_FOLDER, targetFilename);

        fs.writeFileSync(
            targetFilePath,
            pug.renderFile(originalFilePath, { pretty: PRETTY_FLAG })
        );

        console.log(`File ${originalFilename} was write at ${targetFilePath}`);
    } catch (err) {
        console.log(err);
    }
});

// fs.writeFile(
//   'outputHTML.html',
//   pug.renderFile('product.pug', { pretty: PRETTY_FLAG }),
//   errorHandler
// )
