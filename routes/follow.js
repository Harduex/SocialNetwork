var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', (request, response) => {

    var postUserId = request.query.user_id;
    var postUserName = request.query.user_name;

    var currentUserId = request.user.id;
    var currentUserName = request.user.username;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('UsersData');

        let findByCurrentUserId = { userid: currentUserId };
        let findByPostUserId = { userid: postUserId };

        //let incrementFollowing = { $inc: { following: 1 }, $push: { followedBy: currentUserName} };
        //let decrementFollowing = { $inc: { following: -1 }, $pull: { followedBy: currentUserName} };

        let pushNewFollowing = { $push: { following: postUserName }};
        let pushNewFollower = { $push: { followers: currentUserName}};
        
        let pullFollowing = { $pull: { following: postUserName }};
        let pullFollower = { $pull: { followers: currentUserName}};
        

        dbo.collection(currentUserId + '_info').find({ userid: currentUserId }).toArray(function (err, result) {

            var currentUserFollowing = result[0].following;

            if (currentUserFollowing === undefined) {
                dbo.collection(postUserId + '_info').update( findByPostUserId, pushNewFollower );//ivan
                dbo.collection(currentUserId + '_info').update( findByCurrentUserId, pushNewFollowing );//simeon
            } else {

                if (currentUserFollowing.includes(postUserName)) {
                    
                    dbo.collection(postUserId + '_info').update(findByPostUserId, pullFollower);
                    dbo.collection(currentUserId + '_info').update(findByCurrentUserId, pullFollowing);
                } else {
                    
                    dbo.collection(postUserId + '_info').update( findByPostUserId, pushNewFollower );
                    dbo.collection(currentUserId + '_info').update( findByCurrentUserId, pushNewFollowing );
                }
            }

        });

    });

    response.redirect(request.get('referer'));
})

module.exports = router;