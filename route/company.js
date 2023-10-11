const {dbRequest} = require("../utils/connection");

const {checkCompanyOwner} = require("../middleware/company");

const QUERY = require("../utils/query");
const {TRANSLATION, resolve} = require("../utils/translations");
const {VALIDATOR, VALIDATION} = require("../utils/validation")
const {DESCRIPTION, PERMISSION} = require("../utils/description");
const {verifyToken} = require("../middleware/auth");
const {checkAvailableCompany} = require("../middleware/company");

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
                        message: resolve(TRANSLATION.COMPANY.CITY_ID_REQUIRED, req)
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_CITY_ID(city_id))
                    .then(convertCompanyFields)
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
                        message: resolve(TRANSLATION.COMPANY.COMPANY_ID_REQUIRED, req)
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_COMPANY_ID(companyId))
                    .then(res => {
                        if (!res.length) {
                            throw new Error(resolve(TRANSLATION.COMPANY.DESNT_EXIST, req));
                        }

                        return res;
                    })
                    .then(convertCompanyFields)
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
                    .then(convertCompanyFields)
                    .then(r => r.map(o => o.cityId) || [])
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
                const customerId = req.customer.id;

                if (!customerId) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                dbRequest(QUERY.COMPANY.SELECT_BY_CUSTOMER_ID(customerId))
                    .then(convertCompanyFields)
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.GET_BY_CUSTOMER_ID, customerId));
            }]
        },
        {
            method: "post",
            url: "/companies",
            url_example: "/companies",
            details: {
                ...PERMISSION(['4. Check permission to create more companies.']),
                bodyValidation: true,
                requestBody: {
                    name: VALIDATION.COMPANY.name.type,
                    cityId: VALIDATION.COMPANY.cityId.type,
                    street: VALIDATION.COMPANY.street.type,
                    phone1: VALIDATION.COMPANY.phone1.type,
                    phone2: VALIDATION.COMPANY.phone2.type,
                    phone3: VALIDATION.COMPANY.phone3.type,
                    schedule: VALIDATION.COMPANY.schedule.type,
                },
            },
            description: DESCRIPTION.COMPANY.CREATE,
            callbacks: [
                verifyToken,
                checkAvailableCompany,
                function (req, res) {
                    const customerId = req.customer.id;
                    const {name, cityId, street, phone1, phone2, phone3, schedule} = req.body;
                    const joinDate = '' + new Date().getTime();
                    const company = {customerId, name, phone1, phone2, phone3, cityId, street, joinDate, schedule};

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
                    cityId: VALIDATION.COMPANY.cityId.type,
                    street: VALIDATION.COMPANY.street.type,
                    schedule: VALIDATION.COMPANY.schedule.type,
                },
            },
            callbacks: [verifyToken, checkCompanyOwner, function (req, res) {
                const {id, name, phone1, phone2, phone3, cityId, street, schedule} = req.body;
                const company = {id, name, phone1, phone2, phone3, cityId, street, schedule};

                VALIDATOR.COMPANY.UPDATE(company)
                    .then(() => dbRequest(QUERY.COMPANY.UPDATE(company)))
                    .then(() => dbRequest(QUERY.COMPANY.SELECT_BY_COMPANY_ID(id)))
                    .then(convertCompanyFields)
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
            callbacks: [verifyToken, checkCompanyOwner, function (req, res) {
                const {companyId} = req.body;

               dbRequest(QUERY.MENU_ITEM.DELETE_BY_COMPANY_ID(companyId))
                    .then(() => dbRequest(QUERY.COMPANY.DELETE_BY_COMPANY_ID(companyId)))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.COMPANY.DELETE, companyId));
            }]
        },
    ]
};

function convertCompanyFields(companies) {
    return companies.map(company => {
        const {
            ID: id,
            NAME: name,
            PHONE1: phone1,
            PHONE2: phone2,
            PHONE3: phone3,
            PHOTOS: photos,
            CITY_ID: cityId,
            STREET: street,
            JOIN_DATE: joinDate,
            SCHEDULE: schedule
        } = company;

        return {
            id,
            name,
            phone1,
            phone2,
            phone3,
            photos,
            cityId,
            street,
            joinDate,
            schedule
        }
    })
}

module.exports = routes;