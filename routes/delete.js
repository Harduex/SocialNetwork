var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');
const upload = multer({dest: './public/images' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.post('/', function (request, response) {
    fs = require('fs');
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("webAppData");
        var myquery = { title: request.body.post_title };
        dbo.collection("content").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });

    let photo = './public/images/' + request.body.post_title + '.jpg';
    let smallPhoto = './public/images/' + request.body.post_title + '_small.jpg';
    fs.unlinkSync(photo);
    fs.unlinkSync(smallPhoto);

    response.redirect("/");

});

module.exports = router;