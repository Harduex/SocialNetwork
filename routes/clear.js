var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');
const upload = multer({ dest: './public/images' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.post('/', function (request, response) {

    var userId = request.user.id;
    fs = require('fs');

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(userId);
        dbo.collection("content").deleteMany(function (err, obj) {
            if (err) throw err;
            console.log("all documents in collection deleted");
            db.close();
        });
    });

    let dir = `./public/images/${userId}/`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    fs.readdir(dir, (err, files) => {
        if (err) {
            console.log(err);
        }
    
        files.forEach(file => {
            const fileDir = path.join(dir, file);
    
            if (file !== 'profilePic') {
                fs.unlinkSync(fileDir);
            }
        });
    });
    

    response.redirect("/");

});

module.exports = router;