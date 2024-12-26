const mysql = require("mysql2/promise");

module.exports = class {
    connectionPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectionLimit: 10,
        namedPlaceholders: true,
    });

    constructor() {}

    async query(queryString, parameters) {
        try {
            const connection = await this.connectionPool.getConnection();

            const [results, fields] = await connection.execute(
                queryString,
                parameters
            );

            connection.release();

            return new QueryResults(0, "", results || []);
        } catch (err) {
            console.log(err);
            console.log(`error executing query:  ${err.message}`);

            return new QueryResults(err.code, err.message, []);
        }
    }

    async findNewTest() {
        this.connectionPool.establishment
            .find({
                where: { id: 1 },
                attributes: [id],
            })
            .then((result) => {
                console.log(`${result.length} results found`);
            });
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
