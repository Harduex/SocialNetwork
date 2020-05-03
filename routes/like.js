var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', (request, response) => {

    var postId = request.query.post_id;
    var postUserId = request.query.user_id;

    var currentUserId = request.user.id;
    var currentUserName = request.user.username;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('UsersData');

        let findByPostId = { postid: postId };

        let incrementLikes = { $push: { likedBy: currentUserName} };
        let decrementLikes = { $pull: { likedBy: currentUserName} };

        let like = { $push: { postsLiked: postId } };
        let dislike = { $pull: { postsLiked: postId } };

        dbo.collection(currentUserId + '_info').find({ userid: currentUserId }).toArray(function (err, result) {

            if (result[0].postsLiked === undefined) {
                dbo.collection(postUserId + '_posts').update(findByPostId, incrementLikes);
                dbo.collection(currentUserId + '_info').update({ userid: currentUserId }, like, function (err, response) {
                    if (err) throw err;
                });
            } else {
                if (result[0].postsLiked.includes(postId)) {
                    dbo.collection(postUserId + '_posts').update(findByPostId, decrementLikes);
                    dbo.collection(currentUserId + '_info').update({ userid: currentUserId }, dislike, function (err, response) {
                        if (err) throw err;
                    });
                } else {
                    dbo.collection(postUserId + '_posts').update(findByPostId, incrementLikes);
                    dbo.collection(currentUserId + '_info').update({ userid: currentUserId }, like, function (err, response) {
                        if (err) throw err;
                    });
                }
            }

        });



    });

    response.redirect(request.get('referer'));
})

module.exports = router;