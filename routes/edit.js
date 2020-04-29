var express = require('express');
var router = express.Router();

const functions = require('../functions');
var multer = require('multer');
fs = require('fs');
const upload = multer({ dest: './public/images' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.get('/', function (request, response) {
    response.render('editPost.ejs');
});

router.post('/', upload.single('image'), function (request, response) {

    var userId = request.user.id;
    let dir = `./public/images/${userId}/`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var postId = request.body.post_id;

    var PhotoName = request.body.photo_name;
    var TitleBefore = request.body.title_before;
    var Title = request.body.title;
    var Description = request.body.description;

    var oldPhoto = dir + PhotoName + '.jpg';
    var oldSmallPhoto = dir + PhotoName + '_small.jpg';
    // var newPhoto = dir + PhotoName + '.jpg';
    // var newSmallPhoto = dir + PhotoName + '_small.jpg';

    if (!request.file || !request.file.path) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(userId);
            var myquery = { posid: postId };
            var newvalues = { $set: { title: Title, description: Description } };
            dbo.collection("content").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        });
        // if (TitleBefore != Title) {

        //     fs.createReadStream(oldPhoto).pipe(fs.createWriteStream(newPhoto));
        //     fs.createReadStream(oldSmallPhoto).pipe(fs.createWriteStream(newSmallPhoto));

        //     //deleting old photos
        //     fs.unlinkSync(oldPhoto);
        //     fs.unlinkSync(oldSmallPhoto);

        // }

    } else {
        var img = fs.readFileSync(request.file.path);
        var Photo = img.toString('base64');
        fs.unlinkSync(request.file.path);

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(userId);
            var myquery = { postid: postId };
            var newvalues = { $set: { title: Title, photo: { encoded: Photo, name: PhotoName }, description: Description } };
            dbo.collection("content").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        });
        fs.unlinkSync(oldPhoto);
        fs.unlinkSync(oldSmallPhoto);
        functions.decode_save_base64(Photo, PhotoName + '.jpg', userId);

        //deleting temporary string for img convertion


        //deleting old photos
        //fs.unlinkSync(oldPhoto);
        //fs.unlinkSync(oldSmallPhoto);
    }

    response.redirect("/");

});


module.exports = router;