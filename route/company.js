const {dbRequest} = require("../utils");
const QUERY = require("../db/query");
const VALIDATOR = require("../utils/validation")

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

                dbRequest(QUERY.COMPANY.SELECT_BY_CITY(city))
                    .then(dbRes => res.send(dbRes))
                    .catch(
                        e => {
                            console.log('Get company by companyId error', e.message, company)
                            responseError(res, 400, e.message);
                        }
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

                dbRequest(QUERY.COMPANY.SELECT_BY_COMPANY_ID(companyId))
                    .then(dbRes => res.send(dbRes))
                    .catch(
                        e => {
                            console.log('Get company by companyId error', e.message, company)
                            responseError(res, 400, e.message);
                        }
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

                dbRequest(QUERY.COMPANY.SELECT_BY_CUSTOMER_ID(customerId))
                    .then(dbRes => res.send(dbRes))
                    .catch(
                        e => {
                            console.log('Get companies by customer id error', e.message, company)
                            responseError(res, 400, e.message);
                        }
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

                VALIDATOR.COMPANY.CREATE(company)
                    .then(() => dbRequest(QUERY.COMPANY.INSERT(company)))
                    .then(message => responseSuccess(res, message))
                    .catch(
                        e => {
                            console.log('Create company error', e.message, company)
                            responseError(res, 400, e.message);
                        }
                    )
            }
        },
        {
            "method": "put",
            "url": "/companies",
            "description": "Update company.",
            callback: function (req, res) {
                const {id, name, phone, city, street, schedule} = req.body;
                const company = {id, name, phone, city, street, schedule};

                VALIDATOR.COMPANY.UPDATE(company)
                    .then(() => dbRequest(QUERY.COMPANY.UPDATE(company)))
                    .then(() => dbRequest(QUERY.COMPANY.SELECT_BY_COMPANY_ID(id)))
                    .then(updatedCompany => res.send(updatedCompany))
                    .catch(e => {
                        console.log('Update company error', e.message, company)
                        responseError(res, 400, e.message);
                    })
            }
        },
        {
            "method": "delete",
            "url": "/companies/:companyId",
            "description": "Delete company by companyId.",
            callback: function (req, res) {
                const companyId = +req.params.companyId;

                if (!companyId) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.DELETE_BY_COMPANY_ID(companyId))
                    .then(message => responseSuccess(res, message))
                    .catch(e => {
                            console.log('Delete company error', e.message, companyId)
                            responseError(res, 400, e.message);
                        }
                    );
            }
        },
    ]
};


module.exports = routes;