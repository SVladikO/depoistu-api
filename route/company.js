const {dbRequest} = require("../utils");
const QUERY = require("../db/query");
const {validateCompany} = require("../utils/validation")
const {responseError, responseSuccess} = require("../utils/responce")

const routes = {
    "name": "Company",
    "description": "For company data.",
    "routes": [
        // {
        //     "method": "get",
        //     "url": "/companies",
        //     "description": "Get all companies.",
        //     callback: function (req, res) {
        //         dbRequest(QUERY.COMPANY.SELECT_ALL(),
        //             dbRes => res.send(dbRes),
        //             errorMessage => res.send(errorMessage)
        //         );
        //     }
        // },
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
            "method": "post",
            "url": "/companies",
            "description": "Create company.",
            callback: function (req, res) {
                const {customer_id, name, city, street, phone, schedule} = req.body;
                const join_date = '' + new Date().getTime();
                const company = {customer_id, name, phone, city, street, join_date, schedule};

                validateCompany(company)
                    .then(e => {
                        console.log('Create company validation success', company);
                        dbRequest(QUERY.COMPANY.INSERT(company),
                            successMessage => responseSuccess(res, successMessage),
                            errorMessage => responseError(res, 500, errorMessage)
                        );
                    })
                    .catch(e => {
                        console.log('Create company validation error', e.message, company)
                        responseError(res, 400, e.message);
                    })
            }
        },
    ]
};


module.exports = routes;