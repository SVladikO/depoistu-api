const {logRequestDetails, dbRequest} = require("../utils");
const QUERY = require("../db/query");

const routes = {
    "name": "Company",
    "description": "For company data.",
    "routes": [
        {
            "method": "get",
            "url": "/companies",
            "description": "Get all companies.",
            callback: function (req, res) {
                logRequestDetails(req)
                dbRequest(QUERY.COMPANY.SELECT_ALL(), dbRes => res.send(dbRes));
            }
        },
        {
            "method": "get",
            "url": "/companies/:city",
            "description": "Get companies by city. Only Ukrainian for now. Case sensitive.",
            callback: function (req, res) {
                logRequestDetails(req)
                const {city} = req.params;
                dbRequest(QUERY.COMPANY.SELECT_BY_CITY(city), dbRes => res.send(dbRes));
            }
        }
    ]
};


module.exports = routes;