const mysql = require("mysql2/promise");

module.exports = class {
    connection;

    constructor() {}

    async init() {
        this.connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            namedPlaceholders: true,
        });
    }

    async connect() {
        await this.connection.connect(function (err) {
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
    }

    async query(queryString, parameters) {
        try {
            const [results, fields] = await this.connection.execute(
                queryString,
                parameters
            );

            return new QueryResults(0, "", results || []);
        } catch (err) {
            console.log(err);
            console.log("error executing query:  " + err.message);

            return new QueryResults(err.code, err.message, []);
        }
    }
};

class QueryResults {
    errorCode;
    errorMessage;
    rows;

    constructor(errorCode, errorMessage, rows) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.rows = rows;
    }
}

// module.exports = { connection };
