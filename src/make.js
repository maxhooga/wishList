const pug = require('pug');

const fs = require('fs');

const errorHandler = (err) => {
    if(err){
       console.log(err); 
    }else{
        console.log("ready to work");
    }
}

fs.writeFile("outputHTML.html", pug.renderFile('product.pug', {pretty: true}), errorHandler);