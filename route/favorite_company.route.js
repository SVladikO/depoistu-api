const {dbRequest} = require("../utils/connection.utils");

const QUERY = require("../utils/query.utils");
const {DESCRIPTION, PERMISSION} = require("../utils/description.utils");
const {verifyToken} = require("../middleware/auth.middleware");
const {convertCompanyFields} = require("../utils/company.utils")
const {sendHandler, catchHandler} = require("../utils/handler.utils")
const {Logger} = require("../middleware/log.middleware");

const routes = {
    name: "Favorite company",
    description: "For favorite company data.",
    routes: [
        {
            method: "get",
            url: "/favorite-companies/:customerId",
            url_example: "/favorite-companies/2",
            description: DESCRIPTION.FAVORITE_COMPANY.GET_BY_CUSTOMER_ID,
            callbacks: [
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.FAVORITE_COMPANY.GET_BY_CUSTOMER_ID)

                    const {customerId} = req.params;

                    dbRequest(logger.addQueryDB(QUERY.FAVORITE_COMPANY.SELECT_BY_CUSTOMER_ID(customerId)))
                        .then(convertCompanyFields)
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
                }]
        },
        {
            method: "post",
            url: "/favorite-companies",
            url_example: "/favorite-companies",
            details: {
                ...PERMISSION(['4. Check ownership.']),
            },
            description: DESCRIPTION.FAVORITE_COMPANY.CREATE,
            callbacks: [
                verifyToken,
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.FAVORITE_COMPANY.CREATE)

                    const {id: customer_id} = req.customer;
                    const {company_id} = req.body;



                    dbRequest(logger.addQueryDB(QUERY.FAVORITE_COMPANY.ADD(customer_id, company_id)))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
                }]
        },
        {
            method: "delete",
            url: "/favorite-companies",
            url_example: "/favorite-companies",
            details: {
                ...PERMISSION(['4. Check ownership.']),
            },
            description: DESCRIPTION.FAVORITE_COMPANY.DELETE,
            callbacks: [
                verifyToken,
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.FAVORITE_COMPANY.DELETE)

                    const {id: customer_id} = req.customer;
                    const {company_id} = req.body;

                    dbRequest(logger.addQueryDB(QUERY.FAVORITE_COMPANY.DELETE(customer_id, company_id)))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
                }]
        },
    ]
};

module.exports = routes;