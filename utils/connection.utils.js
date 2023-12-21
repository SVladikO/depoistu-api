const mysql = require('mysql2');
const packageJson = require('../package.json')

const prefix = '---->'
let log = (...rest) => console.log(prefix, ...rest);

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    DB_PORT,
    DB_MODE,
    IS_SHOW_ERROR_LOGS,
    IS_SHOW_SUCCESS_LOGS,
    CORS_URL1,
    CORS_URL2,

} = process.env;

console.log(
    'ENV VARIABLES: ',
    {
        DB_HOST,
        DB_USER,
        DB_PASSWORD,
        DB_DATABASE,
        DB_PORT,
        DB_MODE,
        IS_SHOW_ERROR_LOGS,
        IS_SHOW_SUCCESS_LOGS,
        CORS_URL1,
        CORS_URL2,
    }
)
console.log(
    {
        version: packageJson.version
    }
)

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    connectionLimit: 100
});

log('DB environment credentials: ', DB_MODE, DB_HOST);

pool.on('connection', () => log("DB CONNECTED"))
pool.on('end', () => log("DB DISCONNECTED"))
pool.on('error', () => log("## error"))

function dbRequest(query) {
    return new Promise((resolve, reject) => {
        pool.query(
            query,
            (err, results) => {
                if (err) {
                    console.log(1111, 'error: ', err)
                    return reject({errorMessage: 'DB error: ' + err.message, status: 500})
                }

                resolve(results)
            }
        )
    })
}

module.exports = {
    dbRequest,
};