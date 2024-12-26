var express = require("express"),
    router = express.Router();
const mysql = require("mysql2");
const databaseHandler = require("../../../../lib/databaseHandler/index.js");

router.get("/test/databaseHandler", async function (req, res) {
    const db = new databaseHandler();
    // await db.init();
    // await db.connect();
    let queryRes = await db.query(
        `SELECT
            EstablishmentName
        FROM
            lmky_restaurant_inspection_scores
        WHERE TypeDescription = 'FOOD SERVICE'
        LIMIT 1`
    );
    res.send(queryRes.rows);
});

module.exports = router;
