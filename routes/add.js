var express = require('express');
var router = express.Router();

var multer = require('multer');
const upload = multer({ dest: './public/temp' });

const functions = require('../functions');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', function (request, response) {
    response.render('addPost.ejs');
});

router.post('/', upload.single('image'), function (request, response) {

    var userId = request.user.id;
    var postId = functions.random(60);

    fs = require('fs');

    functions.checkProfilePic(userId);

    if (!request.file || !request.file.path) {
        var encoded_image = "iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAABPSURBVFhH7c6xEYBADMCwwErZfzZoGEHFc2c1bn3t7jM/cH89XqNao1qjWqNao1qjWqNao1qjWqNao1qjWqNao1qjWqNao1qjWqNao9bMC9ZQAewAppTcAAAAAElFTkSuQmCC";
    } else {
        //read file from user and save it to /photos
        var img = fs.readFileSync(request.file.path);
        var encoded_image = img.toString('base64');
    }
    var randomStr = functions.random(20);

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    var dateTime =  date + "." + month + "." + year + " " + hours + ":" + minutes ;

    //Upload file to database
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('UsersData');
        var post = {
            photo: randomStr,
            description: request.body.description,
            postid: postId,
            user: request.user.username,
            userid: request.user.id,
            dateAdded: dateTime,
            likes: 0,
            likedBy: []
        };

        // var info = {
        //     postsliked: []
        // };

        dbo.collection(userId + '_posts').insertOne(post, function (err, response) {
            if (err) throw err;
            console.log("1 document inserted");
        });

        db.close();

        var fileName = randomStr;
        functions.decode_save_base64(encoded_image, fileName + '.jpg', userId);

    });
    try {
        if (request.file || request.file.path) {
            fs.unlinkSync(request.file.path);
        }
    } catch (err) {
        response.redirect("/");
    }

    response.redirect("/");

});


module.exports = router;