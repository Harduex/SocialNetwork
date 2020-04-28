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
    fs = require('fs');

    if (!request.file || !request.file.path) {
        var encoded_image = "";
    } else {
        //read file from user and save it to /photos
        var img = fs.readFileSync(request.file.path);
        var encoded_image = img.toString('base64');
    }

    //Upload file to database
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("webAppData");
        var myobj = { title: request.body.title, photo: encoded_image, description: request.body.description };
        dbo.collection("content").insertOne(myobj, function (err, response) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });

        //Saving photo 
        var fileName = request.body.title;
        decode_base64(encoded_image, fileName + '.jpg');
        //var imgpath = path.join(__dirname, 'public/photos/') + fileName + '.jpg';


    });
    if (!request.file || !request.file.path) {

    } else {
        fs.unlinkSync(request.file.path);
    }

    response.redirect("/");

});

function decode_base64(base64str, filename) {
    let buf = Buffer.from(base64str, 'base64');
    let smallPhotoPath = path.join('./public/images/', filename.replace(/(\.[\w\d_-]+)$/i, '_small$1'));
    let originalPhotoPath = path.join('./public/images/', filename);
    const sharp = require('sharp');

    //Saving low quality photo
    sharp(buf)
        .resize(42)
        .rotate()
        .toFile(smallPhotoPath, (err, info) => { if(err) console.log(info); });

    sharp(buf)
        .resize(720)
        .rotate()
        .toFile(originalPhotoPath, (err, info) => { if(err) console.log(info); });
    //Saving original quality photo
    // fs.writeFile(originalPhotoPath, buf, function (error) {
    //     if (error) {
    //         throw error;
    //     } else {

    //     }
    // });
}

module.exports = router;