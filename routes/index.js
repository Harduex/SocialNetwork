var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/', function (request, response) {

    var username = request.user.profile.firstName;
    
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(username);
        dbo.collection("content").find({}).toArray(function (err, content) {
            if (err) throw err;
            //console.log(phones);

            response.render('index.ejs', { content: content });

            db.close();
        });
    });
    console.log("User logged in: " + username);
});

module.exports = router;
