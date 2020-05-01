var express = require('express');
var router = express.Router();

var multer = require('multer');
const upload = multer({ dest: './public/images' });

const functions = require('../functions');

router.get('/', function (request, response) {
    response.render('changeProfilePic.ejs');
});

router.post('/', upload.single('profilePic'), function (request, response) {
    var userId = request.user.id;
    
    var img = fs.readFileSync(request.file.path);
        var Photo = img.toString('base64');
        fs.unlinkSync(request.file.path);
        functions.saveProfilePic(Photo, userId);

    response.redirect("/");
});


module.exports = router;