const {dbRequest} = require("../utils/connection");
const QUERY = require("../utils/query");
const {catchHandler} = require("../utils/handler");
const {resolve, TRANSLATION} = require("../utils/translations");

const checkCompanyOwner = (req, res, next) => {
    const customerId = req.customer.id;
    const {companyId} = req.body;

    dbRequest(QUERY.COMPANY.CHECK_OWNERSHIP_SELECT_BY_COMPANY_ID_AND_CUSTOMER_ID(companyId, customerId))
        .then(res => {
            if (!res.length) {
                throw new Error(resolve(TRANSLATION.COMPANY.ONLY_OWNER_CAN, req));
            }
        })
        .then(() => next())
        .catch(catchHandler(res))
}

const checkAvailableCompany = (req, res, next) => {
    dbRequest(QUERY.COMPANY.SELECT_BY_CUSTOMER_ID(req.customer.id))
        .then(res => {
            if (res.length >= req.customer.canCreateCompanies) {
                throw new Error(resolve(TRANSLATION.COMPANY.MAX_COMPANY_AMOUNT, req));
            }
        })
        .then(() => next())
        .catch(catchHandler(res))
}

module.exports = {
    checkCompanyOwner,
    checkAvailableCompany
}