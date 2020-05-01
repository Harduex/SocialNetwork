module.exports = {
   random: function (length) {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   },
   decode_save_base64: function (base64str, filename, username) {
      let buf = Buffer.from(base64str, 'base64');

      let dir = `./public/images/${username}/`;

      if (!fs.existsSync(dir)) {
         fs.mkdirSync(dir);
      }

      let smallPhotoPath = dir + filename.replace(/(\.[\w\d_-]+)$/i, '_small$1');
      let originalPhotoPath = dir + filename;



      const sharp = require('sharp');

      //Saving low quality photo
      sharp(buf)
         .resize(42)
         .rotate()
         .toFile(smallPhotoPath, (err, info) => { if (err) console.log(info); });

      sharp(buf)
         .resize(720)
         .rotate()
         .toFile(originalPhotoPath, (err, info) => { if (err) console.log(info); });
      //Saving original quality photo
      // fs.writeFile(originalPhotoPath, buf, function (error) {
      //     if (error) {
      //         throw error;
      //     } else {

      //     }
      // });
   },
   saveProfilePic: function (base64str, userId) {
      let buf = Buffer.from(base64str, 'base64');

      let photoPath = `./public/images/${userId}/profilePic/image.jpg`;

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

   },
   checkProfilePic: function (userId) {

      let photoPath = `./public/images/${userId}/profilePic/`;

      if (!fs.existsSync(photoPath)) {
         fs.mkdirSync(photoPath, {recursive: true});
         let buf = Buffer.from('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',
         'base64');
         const sharp = require('sharp');

         sharp(buf)
            .resize({
               width: 200,
               height: 200,
               fit: sharp.fit.cover,
               position: sharp.strategy.entropy
            })
            .rotate()
            .toFile(photoPath+'image.jpg', (err, info) => { if (err) console.log(info); });
      }

   },

}


 //console.log(makeid(10));