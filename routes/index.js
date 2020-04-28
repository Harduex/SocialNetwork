var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/', function (request, response) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("webAppData");
        dbo.collection("content").find({}).toArray(function (err, content) {
            if (err) throw err;
            //console.log(phones);

            response.render('index.ejs', { content: content });

            db.close();
        });
    });

});

module.exports = router;
