var express = require("express"),
    router = express.Router();

router.get("/", function (req, res) {
    res.send("Root restaurant inspections endpoint");
});

module.exports = router;
