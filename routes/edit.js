var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');
fs = require('fs');
const upload = multer({ dest: './public/images' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.get('/', function (request, response) {
    response.render('editPost.ejs');
});

router.post('/', upload.single('image'), function (request, response) {

    var username = request.user.profile.firstName;
    let dir = `./public/images/${username}/`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    var TitleBefore = request.body.title_before;
    var Title = request.body.title;
    var Description = request.body.description;

    var oldPhoto = dir + TitleBefore + '.jpg';
    var oldSmallPhoto = dir + TitleBefore + '_small.jpg';
    var newPhoto = dir + Title + '.jpg';
    var newSmallPhoto = dir + Title + '_small.jpg';

    if (!request.file || !request.file.path) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(username);
            var myquery = { title: TitleBefore };
            var newvalues = { $set: { title: Title, description: Description } };
            dbo.collection("content").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        });
        if (TitleBefore != Title) {

            fs.createReadStream(oldPhoto).pipe(fs.createWriteStream(newPhoto));
            fs.createReadStream(oldSmallPhoto).pipe(fs.createWriteStream(newSmallPhoto));

            //deleting old photos
            fs.unlinkSync(oldPhoto);
            fs.unlinkSync(oldSmallPhoto);
            
        } 

    } else {
        var img = fs.readFileSync(request.file.path);
        var Photo = img.toString('base64');

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(username);
            var myquery = { title: TitleBefore };
            var newvalues = { $set: { title: Title, photo: Photo, description: Description } };
            dbo.collection("content").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        });
        decode_base64(Photo, Title + '.jpg', username);

        //deleting temporary string for img convertion
        fs.unlinkSync(request.file.path);

        //deleting old photos
        fs.unlinkSync(oldPhoto);
        fs.unlinkSync(oldSmallPhoto);
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