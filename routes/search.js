var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.get('/', function (request, response) {
    //Getting post id and photo name from url params
    var search = request.query.search;


    MongoClient.connect(url, function (err, db) {
        if (err) response.redirect('/');
        var dbo = db.db("Users");
        dbo.collection("credentials").find({ username: search }).toArray(function (err, user) {
            if (err) throw err;
            if (user && user.length) {
                var usr = user[0];
                if (request.user.username === search) {
                    response.redirect('/');
                } else {

                    var userInfo = { following: [], followers: [], description: '', followingStatus: '' };
                    db.db("UsersData").collection(usr.id + '_info').find({}).toArray(function (err, user) {
                        var usr = user[0];

                        userInfo.following = usr.following;
                        userInfo.followers = usr.followers;
                        userInfo.description = usr.description;

                        for (i in usr) {
                            if (usr.followers.includes(request.user.username)) {
                                userInfo.followingStatus = "Unfollow";
                            } else {
                                userInfo.followingStatus = "Follow";
                            }
                        }

                    });

                    db.db("UsersData").collection(usr.id + '_posts').find({ userid: user[0].id }).toArray(function (err, content) {
                        if (err) throw err;

                        for (i in content) {
                            if (content[i].likedBy.includes(request.user.username)) {
                                content[i].likeStatus = "Dislike";
                            } else {
                                content[i].likeStatus = "Like";
                            }
                        }

                        response.render('search.ejs', {
                            content: content,
                            user: usr,
                            userInfo: userInfo
                        });
                        db.close();
                    });
                }
            } else {
                response.redirect('/');//set to not found later
            }
        });


    });



});


module.exports = router;