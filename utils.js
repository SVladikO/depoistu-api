const {Pool} = require("pg");
const dbConfig = require("./db/config");

const pool = new Pool(dbConfig);

function dbRequest(dbRequest, onSuccess = () => {
}, onError = () => {
}) {
    console.log('!!!! NEW DB REQUEST !!!!', dbRequest)

    pool.connect().then(client => {
        client.query(dbRequest)
            .then(res => {
                console.log('!!!! DB REQUEST SUCCESS !!!!')
                console.log('DB RESPONSE: ', res.rows)

                client.release()
                onSuccess(res.rows)

            })
            .catch(e => {

                console.log('???? DB REQUEST ERROR ????')
                console.log('???? MESSAGE: ', e.message);
                console.log('???? STACK: ', e.stack);

                client.release()
                onError('DB Error:' + e.message)
            })
    })
}

const getParamMessageRequirements = (paramName, requiredType= 'number') => {
    const message = `Error: Param ${paramName} should be ${requiredType}`;
    console.log('???? ' + message)
    return message;
}

const logRequestDetails = req => {
    console.log('>>>> New request <<<<');
    console.log(req._parsedUrl.pathname);
    console.log(req.route.path);
    console.log('Method: ', req.route.stack[0].method);
}

module.exports = {
    getParamMessageRequirements,
    dbRequest,
    logRequestDetails,
};