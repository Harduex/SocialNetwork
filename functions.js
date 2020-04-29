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
   }

}


 //console.log(makeid(10));