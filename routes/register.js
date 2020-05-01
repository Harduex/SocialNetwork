var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var multer = require('multer');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const functions = require('../functions');


router.get('/', function (request, response) {
    response.render('register.ejs');
});

router.post('/', async (request, response) => {

    let userId = functions.random(20);

    //Validate username
    //request.body.username

    //Validate password
    //request.body.password


    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('Users');
            var myobj = {
                username: request.body.username,
                password: hashedPassword,
                id: userId
            };
    
            dbo.collection("credentials").insertOne(myobj, function (err, response) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
            response.redirect('/login');
        });
    } catch {
        response.redirect('/register');
    }
});


module.exports = router;