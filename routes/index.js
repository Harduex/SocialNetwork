var express = require('express');
var router = express.Router();
var path = require('path')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/', function (request, response) {

    var userId = request.user.id;
    
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(userId);
        dbo.collection("content").find({}).toArray(function (err, content) {
            if (err) throw err;
            //console.log(phones);

            response.render('index.ejs', { content: content });

            db.close();
        });
    });
    console.log("User logged in: " + userId);
});

module.exports = router;
