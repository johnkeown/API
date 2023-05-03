var express = require("express"),
    router = express.Router();
const mysql = require("mysql2");

router.get("/violations", function (req, res) {
    if (
        req.query.premise_name &&
        req.query.premise_address_number &&
        req.query.premise_address_street &&
        req.query.premise_city &&
        req.query.premise_state &&
        req.query.premise_zip &&
        req.query.inspection_date
    ) {
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
            "SELECT *\
          FROM inspection_violations\
          WHERE premise_name = :premise_name\
            AND premise_adr1_num = :premise_address_number\
            AND premise_adr1_street = :premise_address_street\
            AND premise_city = :premise_city\
            AND premise_state = :premise_state\
            AND premise_zip = :premise_zip\
            AND inspection_date = DATE_ADD(:inspection_date, INTERVAL -1 DAY)",
            {
                premise_name: req.query.premise_name,
                premise_address_number: req.query.premise_address_number,
                premise_address_street: req.query.premise_address_street,
                premise_city: req.query.premise_city,
                premise_state: req.query.premise_state,
                premise_zip: req.query.premise_zip,
                inspection_date: req.query.inspection_date,
            },
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
