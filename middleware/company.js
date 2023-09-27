const {dbRequest} = require("../utils/connection");
const QUERY = require("../utils/query");
const {catchHandler} = require("../utils/handler");
const {resolve, TRANSLATION} = require("../utils/translations");

const checkCompanyOwner = (req, res, next) => {
    const customerId = req.customer.id;
    const {companyId} = req.body;

    if (!companyId) {
        return catchHandler(res, 'Check company id in middleware')({
            message: resolve(TRANSLATION.COMPANY.COMPANY_ID_REQUIRED, req)
        })
    }

    dbRequest(QUERY.COMPANY.CHECK_OWNERSHIP_SELECT_BY_COMPANY_ID_AND_CUSTOMER_ID(companyId, customerId))
        .then(res => {
            if (!res.length) {
                throw new Error(resolve(TRANSLATION.COMPANY.ONLY_OWNER_CAN, req));
            }
        })
        .then(() => next())
        .catch(catchHandler(res, 'Check company ownership'))
}

module.exports = {
    checkCompanyOwner
}