var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.get('/', function (request, response) {
    var allPosts = [];
    MongoClient.connect(url, function (err, db) {
        if (err) response.redirect('/');
        var dbo = db.db("UsersData");

        dbo.collection(request.user.id + '_info').find({}).toArray(function (err, user) {
            if (err) throw err;

            var following = user[0].following;


            following.forEach(user => {
                dbo.collection(user.userid + '_posts').find({ userid: user.userid }).toArray(function (err, posts) {

                    posts.forEach(post => {

                        if (post.likedBy.includes(request.user.username)) {
                            post.likeStatus = "Dislike";
                        } else {
                            post.likeStatus = "Like";
                        }

                        allPosts.push(post);

                    });
                });
            });

            db.close();

        });


        // setTimeout(()=> response.json(sortedPosts) ,10);
        setTimeout(() => {
            var sortedPosts = allPosts.sort(function(a,b){ return new Date(b.dateAdded) - new Date(a.dateAdded)});
            response.render('index.ejs', { content: sortedPosts })
        }, 10);

    });



});


module.exports = router;