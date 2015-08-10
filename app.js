var express = require("express");
var multer = require('multer');
var app = express();
var done = false;
var fs = require('fs');
/*Configure the multer.*/

app.use(multer({
    dest: './Uploads/',
    rename: function (fieldname, filename) {

        var d = Date.now();
        var directory = './Uploads' + '/' + d.toString();
        fs.mkdir(directory, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('directory : ' + directory + ' created.');
            }
        });
        return filename;
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done = true;
    }
}));

/*Handling routes.*/

app.get('/', function (req, res) {
    res.sendfile("index.html");
});

app.post('/Uploads', function (req, res) {
    if (done == true) {
        console.log(req.files);
        res.end("File uploaded.");
    }
});

/*Run the server.*/
app.listen(3000, function () {
    console.log("Working on port 3000");
});

