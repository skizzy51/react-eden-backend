const multer = require('multer')
const path = require("path")

const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, path.resolve('images'))
    },
    filename: function (req, file, cb) {
        let [firstpart, secondpart] = file.mimetype.split('/')
        cb(null , `${Date.now().toString()}.${secondpart}`)
    },
})

const uploader = multer({
    storage,
    limits : {
        fileSize : 10000000 //10mb
    },
    fileFilter: (req, file, cb) => {
        const fileext = file.originalname.split(".");
        if (
          file.size >= 10000000 ||
          !["jpg", "jpeg", "png", "svg", "jfif"].includes(
            fileext[fileext.length - 1].toLowerCase()
          )
        ) {
          const err = new Error(
            "Please upload a JPG/JPEG/PNG/SVG/JFIF file less than 10mb"
          );
          err.name = "custom";
          err.status = 400;
          return cb(err);
        }
        cb(undefined, true)
    }
})

const upload = uploader.array("file", 5)

module.exports = upload