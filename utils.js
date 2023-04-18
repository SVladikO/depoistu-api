const mysql = require('mysql2');
const dbConfig = require("./db/config");

const connection = mysql.createConnection(dbConfig);

const prefix = '---->'

function dbRequest(query, resSuccess, resError) {
    connection.query(query, function (err, results) {
        requestDetails(query);

        if (err) {
            console.log(prefix, 'DB request error: ', err.message, err.stack);
            resError('DB Request error:' + err.message)
            return;
        }

        console.log(prefix, 'DB request success: ', results)
        resSuccess(results)
    })
}

function requestDetails(query) {
    console.log(prefix, 'DB request: ', query)
}

const getParamMessageRequirements = (paramName, requiredType = 'number') => {
    const message = `Error: Param ${paramName} should be ${requiredType}`;
    console.log('???? ' + message)
    return message;
}

const provideBEApi = (app, routes) => {
    const api = routes.map(
        ({name, description, routes}) =>
            ({
                name,
                description,
                routes: routes.map(({method, url, description}) => ({method, url, description}))
            })
    );

    app.get('/api', function (req, res) {
        res.json(api);
    })
}

const connectRoutes = (app, routes) => {
    routes.forEach(
        entity => entity.routes.forEach(
            route => app[route.method](route.url, route.callback)
        )
    );
}
const logRequestDetails = (req, res, next) => {
    console.log('>>>> New request <<<<');
    console.log(req.method, req.url);
    req.body && console.log('Body: ', req?.body);
    next();
}

module.exports = {
    getParamMessageRequirements,
    dbRequest,
    logRequestDetails,
    connectRoutes,
    provideBEApi,
};