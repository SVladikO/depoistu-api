const {dbRequest} = require("../utils/connection.utils");
const QUERY = require("../utils/query.utils");
const {catchHandler} = require("../utils/handler.utils");
const {resolveError} = require("../utils/translations.utils");
const {Logger} = require("./log.middleware");

const checkMenuItemOwner = message => (req, res, next) => {
    const logger = new Logger(req);

    const customerId = req.customer.id;
    const {id: menuItemId} = req.body;

    dbRequest(logger.addQueryDB(QUERY.MENU_ITEM.CHECK_OWNERSHIP_SELECT_BY_CUSTOMER_ID_AND_MENU_ITEM_ID(customerId, menuItemId)))
        .then(res => {
            if (!res.length) {
                throw new Error(resolveError("MENU_ITEM.ONLY_OWNER_CAN", req));
            }
        })
        .then(() => next())
        .catch(catchHandler({res, logger, status: 401}))
}

module.exports = {
    checkMenuItemOwner
}