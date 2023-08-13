const mysql = require('mysql2');

const prefix = '---->'
let log = (...rest) => console.log(prefix, ...rest);

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    DB_PORT,
    DB_MODE
} = process.env;

console.log(
    'ENV VARIABLES: '.bold.blue,
    {
        DB_HOST,
        DB_USER,
        DB_PASSWORD,
        DB_DATABASE,
        DB_PORT,
        DB_MODE
    },
)

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    connectionLimit: 100
});

log('DB environment: ', DB_MODE, DB_HOST);

function dbRequest(query) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) reject(err); // not connected!
            connection.query(
                query,
                (err, results) => {

                    if (err) {
                        log(`DB REQUEST ERROR`.bold.red, err);
                        log(query.bold.red)
                        reject(err)
                    }
                    // log(
                    //     query
                    //         .replace(/(?:\r\n|\r|\n)/g, ' ')
                    //         .replace(/\s{2,}/g, ' ')
                    //         .trim()
                    //         .bold.green
                    // )
                    // log('DB REQUEST SUCCESS: '.bold.green, results)
                    resolve(results)
                }
            )
        })
    });
}

module.exports = {
    dbRequest,
};