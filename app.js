require("dotenv-safe").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const mysql = require("mysql2");

app.use(cors());

app.get("/", (req, res) => {
    res.send("");
});

app.get("/search/", (req, res) => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
    connection.connect(function (err) {
        if (err) {
            console.error("error connecting:  " + err.stack);
            return;
        }
    });
    connection.execute(
        "SELECT * FROM inspection_results_food_service_establishments WHERE premise_name LIKE ?",
        ["%" + req.query.search_term + "%"],
        function (err, rows, fields) {
            if (err) throw err;
            res.send({ count: Object.keys(rows).length, results: rows });
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
