const {logRequestDetails, getParamMessageRequirements, dbRequest} = require("../utils");
const QUERY = require("../db/query");

module.exports = function(app) {
    app.get('/company/by/city/:city', function (req, res) {
        logRequestDetails(req)

        const {city} = req.params;

        dbRequest(QUERY.COMPANY.SELECT_BY_CITY(city), dbRes => res.send(dbRes));
    })

    app.get('/company', function (req, res) {
        logRequestDetails(req)

        const {city} = req.params;

        dbRequest(QUERY.COMPANY.SELECT_ALL(), dbRes => res.send(dbRes));
    })
}