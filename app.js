var express=require("express");
var multer  = require('multer');
var app=express();
var done=false;
var fs = require('fs');
var path = require('path');

/*Configure the multer.*/

app.use(multer({ dest: './uploads/',
    rename: function (fieldname, filename) {
        return filename+ '-' + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
        var destination = './files';
        try {
            var stats = fs.statSync(destination);
        } catch (e) {
            fs.mkdirSync(destination);
        }
        var matches = file.name.match(/-(\d+)(\.[a-z]+){0,1}/);
        if (!matches) {
            throw  new Error('Invalid file name!');
        }
        var destDirName = matches[1];
        fs.mkdirSync(path.join(destination, destDirName));

        var destinationPath = path.join(destination, destDirName, matches[1] + (!matches[2] ? '' : matches[2]));
        fs.writeFileSync(destinationPath, fs.readFileSync(file.path));
        fs.unlinkSync(file.path);
        done=true;
    }
}));

/*Handling routes.*/

app.get('/',function(req,res){
    res.sendfile("index.html");
});

app.post('/api/photo',function(req,res){
    if(done==true){
        res.end("File uploaded.");
    }
});

/*Run the server.*/
app.listen(3000,function(){
    console.log("Working on port 3000");
});
