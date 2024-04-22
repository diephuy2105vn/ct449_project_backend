const express = require("express");
const books = require("../controllers/book.controller");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const router = express.Router();

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../public/images"),
    filename: function (req, file, cb) {
        try {
            const customFileName = crypto.randomBytes(18).toString("hex");
            fileExtension = file.originalname.split(".")[1];
            cb(null, "book_" + customFileName + "." + fileExtension);
        } catch (error) {
            console.log(error);
        }
    },
});

const upload = multer({ storage: storage });

router
    .route("/")
    .get(books.findAll)
    .post(upload.single("image"), books.create)
    .delete(books.deleteAll);
router
    .route("/:id")
    .get(books.findOne)
    .put(upload.single("image"), books.update)
    .delete(books.delete);
router.route("/new").get(books.findNew);

module.exports = router;
