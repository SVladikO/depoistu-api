const QUERY = require("./db/query");

function dbRequest(pool, dbRequest, onSuccess, onError) {
    console.log('!!!! NEW DB REQUEST !!!!')

    pool.connect()

    pool.query(dbRequest)
        .then(r => {
            console.log('DB request: ', dbRequest)
            console.log('DB response: ', r.rows)
            pool.end();
            onSuccess(r.rows)
        })
        .catch(e => {
            console.error('DB error: ', e.stack)
            pool.end();
            onError('DB error: ' + e.stack)
        })
}

module.exports = dbRequest;