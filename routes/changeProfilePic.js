var express = require('express');
var router = express.Router();

var multer = require('multer');
const upload = multer({ dest: './public/temp' });


router.get('/', function (request, response) {
    response.render('changeProfilePic.ejs');
});

router.post('/', upload.single('profilePic'), function (request, response) {
    var userId = request.user.id;

    if (!request.file || !request.file.path) {
        response.redirect("/profile");
    } else {
        var img = fs.readFileSync(request.file.path);
        var Photo = img.toString('base64');
        fs.unlinkSync(request.file.path);
        saveProfilePic(Photo, userId);
    }
    response.redirect("/profile");
});

function saveProfilePic(base64str, userId) {
    let buf = Buffer.from(base64str, 'base64');

    let photoPath = `./public/users/${userId}/images/profilePic/image.jpg`;

    if (!fs.existsSync(photoPath)) {
        fs.mkdirSync(photoPath);
    }

    const sharp = require('sharp');

    sharp(buf)
        .resize({
            width: 200,
            height: 200,
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy
        })
        .rotate()
        .toFile(photoPath, (err, info) => { if (err) console.log(info); });

}


module.exports = router;