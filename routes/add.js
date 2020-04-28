var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');
const upload = multer({ dest: './public/images' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', function (request, response) {
    response.render('addPost.ejs');
});

router.post('/', upload.single('image'), function (request, response) {

    var username = request.user.profile.firstName;
    fs = require('fs');

    if (!request.file || !request.file.path) {
        var encoded_image = "iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAABPSURBVFhH7c6xEYBADMCwwErZfzZoGEHFc2c1bn3t7jM/cH89XqNao1qjWqNao1qjWqNao1qjWqNao1qjWqNao1qjWqNao1qjWqNao9bMC9ZQAewAppTcAAAAAElFTkSuQmCC";
    } else {
        //read file from user and save it to /photos
        var img = fs.readFileSync(request.file.path);
        var encoded_image = img.toString('base64');
    }

    //Upload file to database
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(username);
        var myobj = { title: request.body.title, photo: encoded_image, description: request.body.description };
        dbo.collection("content").insertOne(myobj, function (err, response) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });

        //Saving photo 
        var fileName = request.body.title;
        decode_base64(encoded_image, fileName + '.jpg', username);
    });
    try {
        if (request.file || request.file.path) {
            fs.unlinkSync(request.file.path);
        }
    } catch (err) {
        response.redirect("/");
    }

    response.redirect("/");

});

function decode_base64(base64str, filename, username) {
    let buf = Buffer.from(base64str, 'base64');

    let dir = `./public/images/${username}/`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let smallPhotoPath = dir + filename.replace(/(\.[\w\d_-]+)$/i, '_small$1');
    let originalPhotoPath = dir + filename;

    

    const sharp = require('sharp');

    //Saving low quality photo
    sharp(buf)
        .resize(42)
        .rotate()
        .toFile(smallPhotoPath, (err, info) => { if (err) console.log(info); });

    sharp(buf)
        .resize(720)
        .rotate()
        .toFile(originalPhotoPath, (err, info) => { if (err) console.log(info); });
    //Saving original quality photo
    // fs.writeFile(originalPhotoPath, buf, function (error) {
    //     if (error) {
    //         throw error;
    //     } else {

    //     }
    // });
}

module.exports = router;