const {dbRequest} = require("../utils");
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
                dbRequest(QUERY.COMPANY.SELECT_ALL(),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage)
                );
            }
        },
        {
            "method": "get",
            "url": "/companies/by/id/:companyId",
            "description": "Get company by companyId.",
            callback: function (req, res) {
                const companyId = +req.params.companyId;

                if (!companyId) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_COMPANY_ID(companyId),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage)
                );
            }
        },
        {
            "method": "get",
            "url": "/companies/by/id/:companyId",
            "description": "Get company by companyId.",
            callback: function (req, res) {
                logRequestDetails(req);
                const {companyId} = req.params;
                dbRequest(QUERY.COMPANY.SELECT_BY_COMPANY_ID(companyId), dbRes => res.send(dbRes), message => res.send(message));
            }
        },
        {
            "method": "get",
            "url": "/companies/by/city/:city",
            "description": "Get companies by city. Only Ukrainian for now. Case sensitive.",
            callback: function (req, res) {
                const {city} = req.params;

                if (city === 'undefined' || Number.isInteger(+city)) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_CITY(city),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage)
                );
            }
        },
        {
            "method": "get",
            "url": "/companies/by/customer/:customerId",
            "description": "Get companies by customer id.",
            callback: function (req, res) {
                const customerId = +req.params.customerId;

                if (!customerId) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_CUSTOMER_ID(customerId),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage)
                );
            }
        },
        {
            "method": "get",
            "url": "/companies/by/customer/:customerId",
            "description": "Get companies by customer id.",
            callback: function (req, res) {
                logRequestDetails(req)
                const {customerId} = req.params;
                dbRequest(QUERY.COMPANY.SELECT_BY_CUSTOMER_ID(customerId), dbRes => res.send(dbRes), message => res.send(message));
            }
        },
        {
            "method": "post",
            "url": "/companies",
            "description": "Create company.",
            callback: function (req, res) {
                const {name, phones, email, city, street, schedule, photos} = req.body;
                const join_date = '' + new Date().getTime()
                // console.log('Create company', {name, phones, email, city, street, join_date, schedule, photos})
                const company = {name, phones, email, city, street, join_date, schedule, photos};
                dbRequest(QUERY.COMPANY.INSERT(company),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage)
                );
            }
        }
    ]
};


module.exports = routes;