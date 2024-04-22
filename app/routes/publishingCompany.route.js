const express = require("express");
const publishingCompanies = require("../controllers/publishingCompany.controller");

const router = express.Router();

router
    .route("/")
    .get(publishingCompanies.findAll)
    .post(publishingCompanies.create)
    .delete(publishingCompanies.deleteAll);
router
    .route("/:id")
    .get(publishingCompanies.findOne)
    .put(publishingCompanies.update)
    .delete(publishingCompanies.delete);

module.exports = router;
