var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');
const upload = multer({ dest: './public/images' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.post('/', function (request, response) {
    fs = require('fs');
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("webAppData");
        dbo.collection("content").deleteMany(function (err, obj) {
            if (err) throw err;
            console.log("all documents in collection deleted");
            db.close();
        });
    });
    var directory = './public/images/';

    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });

    response.redirect("/");

});

module.exports = router;