const {dbRequest} = require("../utils/connection.utils");
const QUERY = require("../utils/query.utils");
const {catchHandler} = require("../utils/handler.utils");
const {resolve, TRANSLATION} = require("../utils/translations.utils");
const {Logger} = require("./log.middleware");

const checkCompanyOwner = (req, res, next) => {
    const logger = new Logger(req);

    const customerId = req.customer.id;
    const companyId = req.body.companyId || req.body.id;

    if (!companyId) {
        return catchHandler({res, logger})({errorMessage: resolve(TRANSLATION.COMPANY.COMPANY_ID_REQUIRED, req)})
    }

    dbRequest(logger.addQueryDB(QUERY.COMPANY.CHECK_OWNERSHIP_SELECT_BY_COMPANY_ID_AND_CUSTOMER_ID(companyId, customerId)))
        .then(res => {
            if (!res.length) {
                throw new Error(resolve(TRANSLATION.COMPANY.ONLY_OWNER_CAN, req));
            }
        })
        .then(() => next())
        .catch(catchHandler({res, logger}))
}

const checkAvailableCompany = (req, res, next) => {
    const logger = new Logger(req);

    dbRequest(logger.addQueryDB(QUERY.COMPANY.SELECT_BY_CUSTOMER_ID(req.customer.id)))
        .then(res => {
            if (res.length >= req.customer.canCreateCompanies) {
                throw new Error(resolve(TRANSLATION.COMPANY.MAX_COMPANY_AMOUNT, req));
            }
        })
        .then(() => next())
        .catch(catchHandler({res, logger}))
}

module.exports = {
    checkCompanyOwner,
    checkAvailableCompany
}