var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.get('/', function (request, response) {
    response.render('editUser.ejs', { user: request.user });

});

router.post('/', function (request, response) {

    var userId = request.user.id;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('Users');
        var myquery = { id: userId };
        var newvalues = { $set: { username: request.body.username } };
        dbo.collection('credentials').updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("Username changed");
            db.close();
        });
        db.db('UsersData').collection(userId+'_info').updateOne({ userid: userId }, newvalues, function (err, res) {
            if (err) throw err;
        });
        // db.db('UsersData').collection(userId+'_info').updateOne(myquery, newvalues, function (err, res) {
        //     if (err) throw err;
        //     console.log("Username changed");
        //     db.close();
        // });
        

    });

    request.logOut();
    response.redirect("/login");

});


module.exports = router;