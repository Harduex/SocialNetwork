var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', function (request, response) {

    var userId = request.query.user_id;

    MongoClient.connect(url, function (err, db) {
        if (err) response.redirect('/');

        var dbo = db.db("UsersData");
        dbo.collection(userId + '_info').find({ userid: userId }).toArray(function (err, user) {
            if (err) throw err;
            var following = user[0].following;
            response.render('followingList.ejs', { following: following });
            db.close();
        });

    });


});


module.exports = router;