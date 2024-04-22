const express = require("express");
const orderBooks = require("../controllers/orderBook.controller");

const router = express.Router();

router
    .route("/")
    .get(orderBooks.findAll)
    .post(orderBooks.create)
    .delete(orderBooks.deleteAll);
router
    .route("/:id")
    .get(orderBooks.findOne)
    .put(orderBooks.update)
    .delete(orderBooks.delete);

module.exports = router;
