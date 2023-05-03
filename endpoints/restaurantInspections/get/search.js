var express = require("express"),
    router = express.Router();
const mysql = require("mysql2");

router.get("/search", function (req, res) {
    if (req.query.search_term) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
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
            "SELECT * FROM inspection_results_food_service_establishments WHERE premise_name LIKE ?",
            ["%" + req.query.search_term + "%"],
            function (err, rows, fields) {
                res.send({
                    results: rows || [],
                    errorCode: err ? 1 : 0,
                    errorMessage: err ? "An error has occurred" : "",
                });
            }
        );
    } else {
        res.send({
            results: [],
            errorCode: 1,
            errorMessage: "Please enter a search term and try again",
        });
    }
});

module.exports = router;
