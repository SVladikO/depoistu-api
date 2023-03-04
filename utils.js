const mysql = require('mysql2');
const dbConfig = require("./db/config");

const connection = mysql.createConnection(dbConfig);

const prefix = '---->'

function dbRequest(query, resSuccess, resError) {
    connection.query(query, function (err, results, fields) {
        requestDetails(query);

        if (err) return errorHandler(err, resError);

        successHandler(results, resSuccess);
    })
}

function requestDetails(query) {
    console.log(prefix, 'DB request: ', query)
}

function successHandler(results, resSuccess) {
    console.log(prefix, 'DB request success: ', results)
    resSuccess(results)
}

function errorHandler(err, resError) {
    console.log(prefix, 'DB request error: ', err.message, err.stack);
    resError('DB Request error:' + err.message)
}

const getParamMessageRequirements = (paramName, requiredType = 'number') => {
    const message = `Error: Param ${paramName} should be ${requiredType}`;
    console.log('???? ' + message)
    return message;
}

const connectRoutes = (app, routes) => {
    routes.forEach(
        entity => entity.routes.forEach(
            route => app[route.method](route.url, route.callback)
        )
    );
}
const logRequestDetails = req => {
    console.log('>>>> New request <<<<');
    console.log(req.route?.stack[0].method.toUpperCase(), req.url);
    req.body && console.log('Body: ', req?.body);
}

module.exports = {
    getParamMessageRequirements,
    dbRequest,
    logRequestDetails,
    connectRoutes,
};