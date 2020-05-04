var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// router.get('/', (request, response) => {

//     response.render('comment.ejs');
// })

var userId;
var postId;

router.get('/', function (request, response) {

    userId = request.query.user_id;
    username = request.query.user_name;
    postId = request.query.post_id;

    response.render('comment.ejs');

});

router.post('/', function (request, response) {

    var comment = request.body.comment;

    MongoClient.connect(url, function (err, db) {
        if (err) response.redirect('/');

        var dbo = db.db("UsersData");
        dbo.collection(userId + '_posts').updateOne({ postid: postId }, {
            $push: {
                comments: {
                    comment: comment,
                    user: request.user.username
                }
            }
        }, function (err, res) {
            if (err) throw err;

            response.redirect(`/search?search=${username}`);

        });

    });


});

module.exports = router;