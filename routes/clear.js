var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');
const upload = multer({ dest: './public/temp' });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.post('/', function (request, response) {

    var userId = request.user.id;
    fs = require('fs');

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('UsersData');
        dbo.collection(userId+'_posts').deleteMany(function (err, obj) {
            if (err) throw err;
            db.close();
        });
    });

    let dir = `./public/users/${userId}/images/`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
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