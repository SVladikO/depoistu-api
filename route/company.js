const {dbRequest} = require("../utils/connection");
const QUERY = require("../utils/query");
const {VALIDATOR, VALIDATION} = require("../utils/validation")
const {DESCRIPTION, PERMISSION} = require("../utils/description");
const {verifyToken} = require("../middleware/auth");

const {sendHandler, catchHandler} = require("../utils/handler")
const routes = {
    "name": "Company",
    description: "For company data.",
    "routes": [
        {
            method: "get",
            url: "/companies/by/city_id/:city_id",
            url_example: "/companies/by/city_id/102",
            description: DESCRIPTION.COMPANY.GET_BY_CITY_ID,
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
            method: "get",
            url: "/companies/by/id/:companyId",
            url_example: "/companies/by/id/2",
            description: DESCRIPTION.COMPANY.GET_BY_COMPANY_ID,
            callbacks: [function (req, res) {
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
            method: "get",
            url: "/companies/cities",
            url_example: "/companies/cities",
            description: DESCRIPTION.COMPANY.GET_AVAILABLE_CITIES,
            callbacks: [function (req, res) {
                dbRequest(QUERY.COMPANY.SELECT_AVAILABLE_CITIES())
                    .then(r => r.map(o => o.CITY_ID) || [])
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.GET_AVAILABLE_CITIES));
            }]
        },
        {
            method: "get",
            url: "/companies/by/customer",
            url_example: "/companies/by/customer/2",
            details: {
                ...PERMISSION(),
            },
            description: DESCRIPTION.COMPANY.GET_BY_CUSTOMER_ID,
            callbacks: [verifyToken, function (req, res) {
                const customer_id = req.customer.ID;

                if (!customer_id) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_CUSTOMER_ID(customer_id))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.GET_BY_CUSTOMER_ID, customer_id));
            }]
        },
        {
            method: "post",
            url: "/companies",
            url_example: "/companies",
            details: {
                ...PERMISSION(),
                bodyValidation: true,
                requestBody: {
                    name: VALIDATION.COMPANY.name.type,
                    city_id: VALIDATION.COMPANY.city_id.type,
                    street: VALIDATION.COMPANY.street.type,
                    phone1: VALIDATION.COMPANY.phone1.type,
                    phone2: VALIDATION.COMPANY.phone2.type,
                    phone3: VALIDATION.COMPANY.phone3.type,
                    schedule: VALIDATION.COMPANY.schedule.type,
                },
            },
            description: DESCRIPTION.COMPANY.CREATE,
            callbacks: [verifyToken, function (req, res) {
                const customer_id = req.customer.ID;
                const {name, city_id, street, phone1, phone2, phone3, schedule} = req.body;
                const join_date = '' + new Date().getTime();
                const company = {customer_id, name, phone1, phone2, phone3, city_id, street, join_date, schedule};

                VALIDATOR.COMPANY.CREATE(company)
                    .then(() => dbRequest(QUERY.COMPANY.INSERT(company)))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.CREATE, company));
            }]
        },
        {
            method: "put",
            url: "/companies",
            url_example: "/companies",
            description: DESCRIPTION.COMPANY.UPDATE,
            details: {
                ...PERMISSION(['4. Check ownership.']),
                bodyValidation: true,
                requestBody: {
                    id: VALIDATION.COMPANY.id.type,
                    name: VALIDATION.COMPANY.name.type,
                    phone1: VALIDATION.COMPANY.phone1.type,
                    phone2: VALIDATION.COMPANY.phone2.type,
                    phone3: VALIDATION.COMPANY.phone3.type,
                    city_id: VALIDATION.COMPANY.city_id.type,
                    street: VALIDATION.COMPANY.street.type,
                    schedule: VALIDATION.COMPANY.schedule.type,
                },
            },
            callbacks: [verifyToken, function (req, res) {
                const {id, name, phone1, phone2, phone3, city_id, street, schedule} = req.body;
                const company = {id, name, phone1, phone2, phone3, city_id, street, schedule};
                const customer_id = req.customer.ID;

                VALIDATOR.COMPANY.UPDATE(company)
                    .then(() => dbRequest(QUERY.COMPANY.CHECK_OWNERSHIP_SELECT_BY_COMPANY_ID_AND_CUSTOMER_ID(id, customer_id)))
                    .then(res => {
                        if (!res.length) {
                            throw new Error('Only company owners can change data.');
                        }
                    })
                    .then(() => dbRequest(QUERY.COMPANY.UPDATE(company)))
                    .then(() => dbRequest(QUERY.COMPANY.SELECT_BY_COMPANY_ID(id)))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.UPDATE, company))
            }]
        },
        {
            method: "delete",
            url: "/companies",
            url_example: "/companies",
            details: {
                ...PERMISSION(['4. Check ownership.']),
                requestBody: {
                    companyId: VALIDATION.COMPANY.id.type
                }
            },
            description: DESCRIPTION.COMPANY.DELETE,
            callbacks: [verifyToken, function (req, res) {
                const {companyId} = req.body;
                const customerId = req.customer.ID;

                if (!companyId) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.CHECK_OWNERSHIP_SELECT_BY_COMPANY_ID_AND_CUSTOMER_ID(companyId, customerId))
                    .then(res => {
                        if (!res.length) {
                            throw new Error('Only company owners can delete company.');
                        }
                    })
                    .then(() => dbRequest(QUERY.MENU_ITEM.DELETE_BY_COMPANY_ID(companyId)))
                    .then(() => dbRequest(QUERY.COMPANY.DELETE_BY_COMPANY_ID(companyId)))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.DELETE, companyId));
            }]
        },
    ]
};

module.exports = routes;