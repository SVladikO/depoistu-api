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

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
});

log('DB environment: ', DB_MODE, DB_HOST);

function dbRequest(query) {
    return new Promise((resolve, reject) => {
        log('DB TRY TO REQUEST: '.bold.blue, query);
        connection.query(
            query,
            (err, results) => {

                if (err) {
                    log('DB REQUEST ERROR: '.bold.red, err);
                    reject(err)
                }

                log('DB REQUEST SUCCESS: '.bold.green, results)
                resolve(results)
            }
        )
    });
}

module.exports = {
    dbRequest,
};