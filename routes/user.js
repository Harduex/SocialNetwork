var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/:id/:user', function (request, response) {
    //Getting post id and photo name from url params
    var search = request.query.search;


    MongoClient.connect(url, function (err, db) {
        if (err) response.redirect('/');
        var dbo = db.db("UsersData");

        dbo.collection(request.user.id + '_info').find({}).toArray(function (err, user) {

            dbo.collection(request.params.id + '_posts').find({}).toArray(function (err, posts) {

                var usr = user[0];

                response.json({ currentUser: usr, posts: posts });
                db.close();
            });

        });

    });

});


module.exports = router;