var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');
const upload = multer({dest: './public/images' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.post('/', function (request, response) {

    var username = request.user.profile.firstName;
    fs = require('fs');
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(username);
        var myquery = { title: request.body.post_title };
        dbo.collection("content").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });

    let dir = `./public/images/${username}/`;
    let filename = request.body.post_title;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let smallPhotoPath = dir + filename + '_small.jpg';
    let originalPhotoPath = dir + filename + '.jpg';
    
    fs.unlinkSync(originalPhotoPath);
    fs.unlinkSync(smallPhotoPath);

    response.redirect("/");

});

module.exports = router;