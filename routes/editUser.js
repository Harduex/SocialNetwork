var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.get('/', function (request, response) {
    MongoClient.connect(url, function (err, db) {
        db.db('UsersData').collection(request.user.id + '_info')
            .find({ userid: request.user.id })
            .toArray(function (err, result) {

                response.render('editUser.ejs', { user: result[0] });
            });
    });

});

router.post('/', function (request, response) {

    var userId = request.user.id;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myquery = { userid: userId };
        var newvalues = { $set: { description: request.body.description } };

        db.db('UsersData').collection(userId + '_info').updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
        });

    });

    response.redirect("/");

});


module.exports = router;