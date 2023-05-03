var express = require("express"),
    router = express.Router();
const mysql = require("mysql2");

router.get("/latest", function (req, res) {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        namedPlaceholders: true,
    });
    connection.connect(function (err) {
        if (err) {
            console.error("error connecting:  " + err.stack);
            res.send({
                results: [],
                errorCode: err.code,
                errorMessage: err ? "An error has occurred" : "",
            });
            return;
        }
    });
    connection.execute(
        "SELECT * FROM inspection_results_food_service_establishments ORDER BY date_recent DESC, premise_name LIMIT :limit",
        { limit: "30" },
        function (err, rows, fields) {
            res.send({
                results: rows || [],
                errorCode: err ? 1 : 0,
                errorMessage: err ? err : "",
            });
        }
    );
});

module.exports = router;
