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

                    console.log(usr);

                    db.db("UsersData").collection(usr.id).find({ user: user[0].username }).toArray(function (err, content) {
                        if (err) throw err;

                        response.render('search.ejs', {
                            content: content,
                            user: usr
                        });
                        console.log(content);
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