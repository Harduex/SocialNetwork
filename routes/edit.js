var express = require('express');
var router = express.Router();

// const bodyParser = require('body-parser');
// const url = require('url');
// const querystring = require('querystring');

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());

var multer = require('multer');
fs = require('fs');
const upload = multer({ dest: './public/temp' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var postId;
var PhotoName;
var Description;

router.get('/', function (request, response) {
    response.render('editPost.ejs');

    //Getting post id and photo name from url params
    postId = request.query.post_id;
    PhotoName = request.query.photo_name;
});

router.post('/', upload.single('image'), function (request, response) {

    var userId = request.user.id;

    Description = request.body.description;

    let dir = `./public/users/${userId}/images/`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    if (!request.file || !request.file.path) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('UsersData');
            var myquery = { postid: postId };
            var newvalues = { $set: { description: Description } };
            dbo.collection(userId + '_posts').updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                db.close();
            });

        });
    } else {
        var img = fs.readFileSync(request.file.path);
        var Photo = img.toString('base64');
        fs.unlinkSync(request.file.path);
        decode_save_base64(Photo, PhotoName + '.jpg', userId);

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('UsersData');
            var myquery = { postid: postId };
            var newvalues = { $set: { description: Description } };
            dbo.collection(userId + '_posts').updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                db.close();
            });

        });
    }

    response.redirect("/profile");

});

function decode_save_base64(base64str, filename, username) {
    let buf = Buffer.from(base64str, 'base64');

    let dir = `./public/users/${username}/images/`;

    if (!fs.existsSync(dir)) {
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
}


module.exports = router;