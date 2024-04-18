const express = require("express");
const router = express.Router();

var root = require("./get");
var search = require("./get/search");
var latest = require("./get/latest");
var dangerZone = require("./get/dangerZone");
var violations = require("./get/violations");
var testDatabaseHandler = require("./test/get/databaseHandler");
var testDatabaseHandlerParams = require("./test/get/databaseHandlerParams");

router.use(
    "/",
    root,
    search,
    latest,
    dangerZone,
    violations,
    testDatabaseHandler,
    testDatabaseHandlerParams
);

module.exports = router;
