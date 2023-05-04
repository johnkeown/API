var express = require("express"),
    router = express.Router();
const mysql = require("mysql2");

router.get("/dangerZone", function (req, res) {
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
        *
    FROM
        (
        SELECT
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
        WHERE TypeDescription = 'FOOD SERVICE'
        GROUP BY
            EstablishmentID
    ) AS latestInspections
    WHERE
        Grade = 'C'
    ORDER BY
        EstablishmentName,
        Address`,
        // "SELECT * FROM inspection_results_food_service_establishments WHERE grade_recent = 'C' ORDER BY date_recent DESC, premise_name DESC",
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
