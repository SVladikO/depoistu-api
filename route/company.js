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
            "url": "/companies/?x=:city",
            "description": "Get companies by city. Only Ukrainian for now. Case sensitive.",
            callback: function (req, res) {
                logRequestDetails(req)
                const {city} = req.params;
                dbRequest(QUERY.COMPANY.SELECT_BY_CITY(city), dbRes => res.send(dbRes), message => res.send(message));
            }
        },
        {
            "method": "post",
            "url": "/companies",
            "description": "Create company.",
            callback: function (req, res) {
                logRequestDetails(req);
                const {name, phones, email, city, street, schedule, photos} = req.body;
                const join_date = '' + new Date().getTime()
                console.log(1111, name, phones, email, city, street, join_date, schedule, photos)
                const company = {name, phones, email, city, street, join_date, schedule, photos};
                dbRequest(QUERY.COMPANY.INSERT(company), dbRes => res.send(dbRes), message => res.send(message));
            }
        }
    ]
};


module.exports = routes;