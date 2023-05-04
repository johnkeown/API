var express = require("express"),
    router = express.Router();
const mysql = require("mysql2");

router.get("/violations", function (req, res) {
    if (req.query.establishment_id && req.query.inspection_id) {
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
            `SELECT
            EstablishmentID,
            InspectionDate,
            InspectionID,
            InspectionType,
            score,
            InspTypeSpecificViolID,
            ViolationDesc,
            critical_yn,
            Insp_Viol_Comments,
            rpt_area_id
        FROM
            lmky_inspection_violations_of_failed_restaurants
        WHERE
            EstablishmentID = :establishment_id
            AND InspectionID = :inspection_id`,
            {
                establishment_id: req.query.establishment_id,
                inspection_id: req.query.inspection_id,
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
