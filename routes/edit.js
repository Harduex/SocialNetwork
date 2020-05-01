var express = require('express');
var router = express.Router();

// const bodyParser = require('body-parser');
// const url = require('url');
// const querystring = require('querystring');

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());

const functions = require('../functions');
var multer = require('multer');
fs = require('fs');
const upload = multer({ dest: './public/images' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var postId;
var PhotoName;
var Title;
var Description;

router.get('/', function (request, response) {
    response.render('editPost.ejs');
    
    //Getting post id and photo name from url params
    postId = request.query.post_id;
    PhotoName = request.query.photo_name;
});

router.post('/', upload.single('image'), function (request, response) {

    var userId = request.user.id;

    Title = request.body.title;
    Description = request.body.description;

    let dir = `./public/users/${userId}/images/`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    if (!request.file || !request.file.path) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(userId);
            var myquery = { postid: postId };
            var newvalues = { $set: { title: Title, description: Description } };
            dbo.collection("content").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });

        });
    } else {
        var img = fs.readFileSync(request.file.path);
        var Photo = img.toString('base64');
        fs.unlinkSync(request.file.path);
        functions.decode_save_base64(Photo, PhotoName + '.jpg', userId);

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(userId);
            var myquery = { postid: postId };
            var newvalues = { $set: { title: Title, description: Description } };
            dbo.collection("content").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });

        });
    }

    response.redirect("/");

});


module.exports = router;