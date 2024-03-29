var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');
const upload = multer({ dest: './public/temp' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.post('/', function (request, response) {

    var userId = request.user.id;
    fs = require('fs');
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('UsersData');

        var postId = request.body.post_id;
        let dir = `./public/users/${userId}/images/`;
        var fileName = request.body.photo_name;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        let smallPhotoPath = dir + fileName + '_small.jpg';
        let originalPhotoPath = dir + fileName + '.jpg';

        fs.unlinkSync(originalPhotoPath);
        fs.unlinkSync(smallPhotoPath);

        var myquery = { postid: postId };

        dbo.collection(userId+'_posts').deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            db.close();
        });
    });

    response.redirect("/profile");

});

module.exports = router;