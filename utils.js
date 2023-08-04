const mysql = require('mysql2');
const dbConfig = require("./db/config");

const getMode = () => process.env.NODE_ENV || 'develop';
const connection = mysql.createConnection(dbConfig[getMode()]);

const prefix = '---->'
console.log(prefix, 'DB environment: ', getMode());

function dbRequest(query) {
    return new Promise((resolve, reject) => {
        connection.query(
            query,
            (err, results) => {
                console.log(prefix, 'DB request: ', query);

                if (err) {
                    console.log(prefix, 'DB request error: ', err);
                    reject(err)
                }

                console.log(prefix, 'DB request success: ', results)
                resolve(results)
            }
        )
    });
}

/**
 * The problem started from DB. IS_VISIBLE field is BOOLEAN type but save 0 / 1 . We should save only these values.
 *
 * @param value
 * @return {number}
 */
const validateIsVisible = value => +(!!value);

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
                routes: routes.map(({method, url, url_example, description, details}) => ({method, details, url, url_example, description}))
            })
    );

    app.get('/api', function (req, res) {
        res.json(api);
    })
}

const connectRoutes = (app, routes) => {
    routes.forEach(
        entity => entity.routes.forEach(
            route => app[route.method](route.url, ...route.callbacks)
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
    validateIsVisible,
    getMode,
    getParamMessageRequirements,
    dbRequest,
    logRequestDetails,
    connectRoutes,
    provideBEApi,
};