const {Pool} = require("pg");
const dbConfig = require("./db/config");

const pool = new Pool(dbConfig);

function dbRequest(dbRequest, onSuccess, onError) {
    console.log('!!!! NEW DB REQUEST !!!!', dbRequest)

    pool.connect().then(client => {
        client.query(dbRequest)
            .then(res => {
                console.log('<<<<<<< DB REQUEST SUCCESS >>>>>>>')
                console.log('DB RESPONSE: ', res.rows)

                client.release()
                onSuccess(res.rows)

            })
            .catch(e => {

                console.log('??????? DB REQUEST ERROR ??????????')
                console.log('??????? MESSAGE: ', e.message);
                console.log('??????? STACK: ', e.stack);

                client.release()
                onError('DB Error:' + e.message)
            })
    })



    // pool.connect()
    // pool.query(dbRequest)
    //     .then(r => {
    //         console.log('DB request: ', dbRequest)
    //         console.log('DB response: ', r.rows)
    //         onSuccess(r.rows)
    //     })
    //     .catch(e => {
    //         console.error('DB error: ', e.stack)
    //         onError('DB error: ' + e.stack)
    //     })
}

module.exports = dbRequest;