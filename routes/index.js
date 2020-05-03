var express = require('express');
var router = express.Router();
var path = require('path')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/', function (request, response) {

    var userId = request.user.id;
    

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('UsersData');
        var user;
        dbo.collection(userId+'_info').find({}).toArray(function (err, usr) {
            user = {...request.user, ...usr[0]};
            console.log(user);
        });

        dbo.collection(userId+'_posts').find({}).toArray(function (err, content) {
            if (err) throw err;
            
            response.render('index.ejs', { content: content,
                                            user: user
                                         });

            db.close();
        });
    });
    console.log("User logged in: " + request.user.username);
});



module.exports = router;
