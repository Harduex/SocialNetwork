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
        dbo.collection("content").findOne(myquery, function (err, result) {
            if (err) throw err;
            let dir = `./public/images/${username}/`;
            var fileName = result.photo.name;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
        
            let smallPhotoPath = dir + fileName + '_small.jpg';
            let originalPhotoPath = dir + fileName + '.jpg';
    
            fs.unlinkSync(originalPhotoPath);
            fs.unlinkSync(smallPhotoPath);
        });

        var myquery = { title: request.body.post_title };
        dbo.collection("content").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });

    response.redirect("/");

});

module.exports = router;