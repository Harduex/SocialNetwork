var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', function (request, response) {

    var postId = request.query.post_id;
    var userId = request.query.user_id;

    MongoClient.connect(url, function (err, db) {
        if (err) response.redirect('/');

        var dbo = db.db("UsersData");
        dbo.collection(userId + '_posts').find({ postid: postId }).toArray(function (err, post) {
            if (err) throw err;
            var comments = post[0].comments;
            response.render('commentsList.ejs', { comments: comments });
            db.close();
        });

    });


});


module.exports = router;