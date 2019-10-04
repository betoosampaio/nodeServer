const multer = require('multer');
const path = require('path');
const uuidv1 = require('uuid/v1');
const sharp = require('sharp');
const fs = require('fs');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/')
    },
    filename: function (req, file, cb) {
        file._id = uuidv1();
        file.uploadDate = new Date();
        cb(null, `${file._id}${path.extname(file.originalname)}`);
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

let upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
}).single('imagem');


module.exports.upload = async (req, res, next) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        await redimensionar(req.file);
        next();
    });
};

redimensionar = async (file) =>{
    sharp.cache(false);
    let img = await sharp(file.path).resize(200, 200).png().toBuffer();
    fs.unlink(file.path, () => { });
    file.sizeResized = img.byteLength;
    file.filename = `${file._id}.png`
    file.path = `public\\uploadimg\\${file.filename}`
    fs.writeFile(file.path, img, (err) => { if (err) throw err; });
}