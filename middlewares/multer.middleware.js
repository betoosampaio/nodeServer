const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploadimg/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

let limits = {
    fileSize: 2 * 1024 * 1024 // 2mb
}

let fileFilter = function (req, file, cb) {
    const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];
    if (allowedMimes.includes(file.mimetype))
        cb(null, true)
    else
        cb(new Error("Invalid file type"));
}

let upload = multer({ storage: storage, limits: limits, fileFilter: fileFilter }).single('imagem');


module.exports.uploadimg = (req, res, next) =>{
    upload(req, res, function (err) {
        if (err) {
          return res.status(400).send(err.message);
        }     
        next();  
      })
};