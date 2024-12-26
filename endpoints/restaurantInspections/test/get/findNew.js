var express = require("express"),
    router = express.Router();
const mysql = require("mysql2");
const databaseHandler = require("../../../../lib/databaseHandler/index.js");

router.get("/test/findNew", async function (req, res) {
    const db = new databaseHandler();
    // await db.init();
    // await db.connect();
    await db.findNewTest();
    res.send();
});

module.exports = router;
