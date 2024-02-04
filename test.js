const fs = require('fs');
const path = require('path');
const folder = path.join("C:\\Users\\lutfi\\Desktop\\hack\\rurutbl.github.io\\classes\\");


const json = {}
fs.readdir(folder, (err, files) => {
    files.forEach(file => {
        json[file] = [];

        const file_path = path.join(folder, file);
        
        fs.readdir(file_path, (err, files2) => {
            files2.forEach(file2 => {
                json[file].push(file2);
            });

            console.log(json)
        });

    });
});
