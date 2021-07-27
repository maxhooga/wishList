const pug = require('pug');
const fs = require('fs');
const path = require('path');

const PAGES_FOLDER = path.resolve('src', 'pages'); // `${__dirname}/src/pages`
const DIST_FOLDER = path.resolve('dist'); // `${__dirname}/dist`
const PRETTY_FLAG = true;

if (!fs.existsSync(DIST_FOLDER)) {
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

const files = fs.readdirSync(PAGES_FOLDER);
console.log(files);

files.forEach((filename) => {
    const chunks = filename.split('.');
    const filePath = path.join(PAGES_FOLDER, filename);
    fs.writeFile(
        path.join(DIST_FOLDER, `${chunks.slice(0, chunks.length - 1).join('.')}.html`),
        pug.renderFile(filePath, { pretty: PRETTY_FLAG }),
        errorHandler(filename, filePath)
    );
});

// fs.writeFile(
//   'outputHTML.html',
//   pug.renderFile('product.pug', { pretty: PRETTY_FLAG }),
//   errorHandler
// )
