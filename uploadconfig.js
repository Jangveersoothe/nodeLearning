const multer = require("multer");
const path = require("path");

const allowedMimes = [
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/msword"
];

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb){
        const unique_name = Date.now() + Math.round(Math.random()*1e9);
        const ext = path.extname(file.originalname);

        cb(null, file.fieldname +"-"+ unique_name + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if(allowedMimes.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb('Error: Incorrect file format!');
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024}
})

module.exports = upload;