require("dotenv-safe").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const mysql = require("mysql2");

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/search/", (req, res) => {
    console.log(`params:  ${JSON.stringify(req.params)}`);
    console.log(`query:  ${JSON.stringify(req.query)}`);
    console.log("search_term:  " + req.query.search_term);
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

        console.log("connected as id " + connection.threadId);
    });
    connection.execute(
        "SELECT * FROM inspection_results_food_service_establishments WHERE premise_name LIKE ?",
        ["%" + req.query.search_term + "%"],
        function (err, rows, fields) {
            if (err) throw err;
            console.log("err:  " + err);
            console.log("rows.count:  " + Object.keys(rows).length);
            res.send({ count: Object.keys(rows).length, results: rows });
        }
    );
});

app.get("/mysql", (req, res) => {
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

        console.log("connected as id " + connection.threadId);
    });
    connection.query(
        "SELECT COUNT(*) AS count FROM raw_inspections",
        (err, rows, fields) => {
            if (err) throw err;
            res.send(`${rows[0].count} rows found`);
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
