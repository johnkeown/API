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
            `SELECT
            EstablishmentID,
            InspectionID,
            Ins_TypeDesc,
            EstablishmentName,
            Address,
            Address2,
            City,
            State,
            Zip,
            TypeDescription,
            MAX(InspectionDate) AS InspectionDate,
            score,
            Grade
        FROM
            lmky_restaurant_inspection_scores
        WHERE
            EstablishmentName LIKE ?
            AND TypeDescription = 'FOOD SERVICE'
            AND Grade != ''
        GROUP BY EstablishmentID
        ORDER BY
            InspectionDate DESC,
            EstablishmentName`,
            ["%" + req.query.search_term + "%"],
            function (err, rows, fields) {
                res.send({
                    results: rows || [],
                    errorCode: err ? 1 : 0,
                    errorMessage: err ? "An error has occurred" : "",
                });
                connection.execute(
                    `INSERT INTO log_search_term (search_term, hostname) VALUES (?, ?)`,
                    [req.query.search_term, req.hostname],
                    function (err, row, fields) {
                        res.end();
                    }
                );
            }
        );
    } else {
        res.send({
            results: [],
            errorCode: 1,
            errorMessage: "Please enter a search term and try again",
        }).end();
    }
});

module.exports = router;
