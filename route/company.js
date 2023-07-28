const {dbRequest} = require("../utils");
const QUERY = require("../db/query");
const VALIDATOR = require("../utils/validation")
const DESCRIPTION = require("../utils/description");
const {verifyToken} = require("../middleware/auth");

const {sendHandler, catchHandler} = require("../utils/responce")

const routes = {
    "name": "Company",
    "description": "For company data.",
    "routes": [
        {
            "method": "get",
            "url": "/companies/by/city_id/:city_id",
            "description": DESCRIPTION.COMPANY.GET_BY_CITY_ID,
            callbacks: [function (req, res) {
                const {city_id} = req.params;

                if (city_id === 'undefined') {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_CITY_ID(city_id))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.GET_BY_CITY_ID, city_id))
            }]
        },
        {
            "method": "get",
            "url": "/companies/by/id/:companyId",
            "description": DESCRIPTION.COMPANY.GET_BY_COMPANY_ID,
            callbacks: [ function (req, res) {
                const companyId = +req.params.companyId;

                if (!companyId) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_COMPANY_ID(companyId))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.GET_BY_COMPANY_ID, companyId));
            }]
        },
        {
            "method": "get",
            "url": "/companies/by/customer/:customerId",
            "description": DESCRIPTION.COMPANY.GET_BY_CUSTOMER_ID,
            callbacks: [verifyToken, function (req, res) {
                const customerId = +req.params.customerId;

                if (!customerId) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_CUSTOMER_ID(customerId))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.GET_BY_CUSTOMER_ID, customerId));
            }]
        },
        {
            "method": "get",
            "url": "/companies/cities",
            "description": DESCRIPTION.COMPANY.GET_AVAILABLE_CITIES,
            callbacks: [ function (req, res) {
                dbRequest(QUERY.COMPANY.SELECT_AVAILABLE_CITIES())
                    .then(r => r.map(o => o.CITY_ID) || [])
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.GET_AVAILABLE_CITIES));
            }]
        },
        {
            "method": "post",
            "url": "/companies",
            "description": DESCRIPTION.COMPANY.CREATE,
            callbacks: [verifyToken, function (req, res) {
                const {customer_id, name, city_id, street, phone, schedule} = req.body;
                const join_date = '' + new Date().getTime();
                const company = {customer_id, name, phone, city_id, street, join_date, schedule};

                VALIDATOR.COMPANY.CREATE(company)
                    .then(() => dbRequest(QUERY.COMPANY.INSERT(company)))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.CREATE, company));
            }]
        },
        {
            "method": "put",
            "url": "/companies",
            "description": DESCRIPTION.COMPANY.UPDATE,
            callbacks: [verifyToken, function (req, res) {
                const {id, name, phone, city_id, street, schedule} = req.body;
                const company = {id, name, phone, city_id, street, schedule};

                VALIDATOR.COMPANY.UPDATE(company)
                    .then(() => dbRequest(QUERY.COMPANY.UPDATE(company)))
                    .then(() => dbRequest(QUERY.COMPANY.SELECT_BY_COMPANY_ID(id)))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.UPDATE, company))
            }]
        },
        {
            "method": "delete",
            "url": "/companies/:companyId",
            "description": DESCRIPTION.COMPANY.DELETE,
            callbacks: [verifyToken, function (req, res) {
                const companyId = +req.params.companyId;

                if (!companyId) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.DELETE_BY_COMPANY_ID(companyId))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.DELETE, companyId));
            }]
        },
    ]
};

module.exports = routes;