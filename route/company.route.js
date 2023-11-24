const {dbRequest} = require("../utils/connection.utils");

const {checkCompanyOwner} = require("../middleware/company.middleware");

const {verifyToken} = require("../middleware/auth.middleware");
const {checkAvailableCompany} = require("../middleware/company.middleware");

const QUERY = require("../utils/query.utils");
const {VALIDATOR, VALIDATION} = require("../utils/validation.utils")
const {resolveError, throwError} = require("../utils/translations.utils");
const {DESCRIPTION, PERMISSION} = require("../utils/description.utils");
const {convertCompanyFields} = require("../utils/company.utils")

const {sendHandler, catchHandler} = require("../utils/handler.utils")
const {Logger} = require("../middleware/log.middleware");

const routes = {
    "name": "Company",
    description: "For company data.",
    "routes": [
        {
            method: "get",
            url: "/available-city-ids",
            url_example: "/available-city-ids",
            description: DESCRIPTION.COMPANY.GET_AVAILABLE_CITIES,
            callbacks: [function (req, res) {
                const logger = new Logger(req);
                logger.addLog(DESCRIPTION.COMPANY.GET_AVAILABLE_CITIES)

                dbRequest(logger.addQueryDB(QUERY.COMPANY.SELECT_AVAILABLE_CITIES()))
                    .then(convertCompanyFields)
                    .then(r => r.map(o => o.cityId) || [])
                    .then(sendHandler(res, logger))
                    .catch(catchHandler({res, logger, status: 400}));
            }]
        },
        {
            method: "get",
            url: "/companies/cities/:city_id",
            url_example: "/companies/cities/204",
            description: DESCRIPTION.COMPANY.GET_BY_CITY_ID,
            callbacks: [function (req, res) {
                const logger = new Logger(req);
                logger.addLog(DESCRIPTION.COMPANY.GET_BY_CITY_ID)

                const {city_id} = req.params;

                if (city_id === 'undefined') {
                    return catchHandler({res, logger})(resolveError("COMPANY.CITY_ID_REQUIRED", req))
                }

                dbRequest(logger.addQueryDB(QUERY.COMPANY.SELECT_BY_CITY_ID(city_id)))
                    .then(convertCompanyFields)
                    .then(sendHandler(res, logger))
                    .catch(catchHandler({res, logger, status: 400}))
            }]
        },
        {
            method: "get",
            url: "/companies/:companyId",
            url_example: "/companies/2",
            description: DESCRIPTION.COMPANY.GET_BY_COMPANY_ID,
            callbacks: [function (req, res) {
                const logger = new Logger(req);
                logger.addLog(DESCRIPTION.COMPANY.GET_BY_COMPANY_ID)

                const companyId = +req.params.companyId;


                if (!companyId) {
                    return catchHandler({
                        res,
                        status: 400,
                        logger
                    })(resolveError("COMPANY.COMPANY_ID_REQUIRED", req))
                }

                dbRequest(logger.addQueryDB(QUERY.COMPANY.SELECT_BY_COMPANY_ID(companyId)))
                    .then(res => {
                        if (!res.length) {
                            throwError("COMPANY.DESNT_EXIST", req);
                        }

                        return res;
                    })
                    .then(convertCompanyFields)
                    .then(sendHandler(res, logger))
                    .catch(catchHandler({res, logger, status: 400}));
            }]
        },
        {
            method: "get",
            url: "/companies/customers/:customerId",
            url_example: "/companies/customers/1",
            description: DESCRIPTION.COMPANY.GET_BY_CUSTOMER_ID,
            callbacks: [
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.COMPANY.GET_BY_CUSTOMER_ID)

                    const {customerId} = req.params;

                    if (!customerId) {
                        return catchHandler({res, status: 400, logger})(resolveError("COMPANY.CITY_ID_REQUIRED", req))
                    }

                    dbRequest(logger.addQueryDB(QUERY.COMPANY.SELECT_BY_CUSTOMER_ID(customerId)))
                        .then(convertCompanyFields)
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger, status: 400}));
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
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.COMPANY.CREATE)

                    const customerId = req.customer.id;
                    const {name, cityId, street, phone1, phone2, phone3, schedule} = req.body;
                    const joinDate = '' + new Date().getTime();
                    const company = {customerId, name, phone1, phone2, phone3, cityId, street, joinDate, schedule};

                    VALIDATOR.COMPANY.CREATE(company)
                        .then(() => dbRequest(logger.addQueryDB(QUERY.COMPANY.INSERT(company))))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger, status: 400}));
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
            callbacks: [
                verifyToken,
                checkCompanyOwner(req => req.body.id),
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.COMPANY.UPDATE)

                    const {id, name, phone1, phone2, phone3, cityId, street, schedule} = req.body;
                    const company = {id, name, phone1, phone2, phone3, cityId, street, schedule};

                    VALIDATOR.COMPANY.UPDATE(company)
                        .then(() => dbRequest(logger.addQueryDB(QUERY.COMPANY.UPDATE(company))))
                        .then(() => dbRequest(logger.addQueryDB(QUERY.COMPANY.SELECT_BY_COMPANY_ID(id))))
                        .then(convertCompanyFields)
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger, status: 400}))
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
            callbacks: [
                verifyToken,
                checkCompanyOwner(req => req.body.id),
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.COMPANY.DELETE)

                    const {companyId} = req.body;

                    dbRequest(logger.addQueryDB(QUERY.MENU_ITEM.DELETE_BY_COMPANY_ID(companyId)))
                        .then(() => dbRequest(logger.addQueryDB(QUERY.COMPANY.DELETE_BY_COMPANY_ID(companyId))))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger, status: 400}));
                }]
        },
    ]
};


module.exports = routes;