const QUERY = require("./db/query");

function dbRequest(pool, dbRequest, onSuccess, onError) {
    console.log('!!!! NEW DB REQUEST !!!!')

    pool.connect((err) => {
        if (err) {
            console.error('CONNECTED WITH ERROR. WOW', err.stack)
        } else {
        console.log('CONNECTED !!!')
        }
    })

    pool.query(dbRequest)
        .then(r => {
            console.log('DB request: ', dbRequest)
            console.log('DB response: ', r.rows)
            onSuccess(r.rows)
        })
        .catch(e => {
            console.error('DB error: ', e.stack)
            onError('DB error: ' + e.stack)
        })
}

module.exports = dbRequest;