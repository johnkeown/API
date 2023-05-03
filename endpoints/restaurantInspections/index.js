var express = require("express"),
    router = express.Router();

var root = require("./get");
var search = require("./get/search");
var latest = require("./get/latest");
var dangerZone = require("./get/dangerZone");
var violations = require("./get/violations");

router.use("/", root, search, latest, dangerZone, violations);

module.exports = router;
