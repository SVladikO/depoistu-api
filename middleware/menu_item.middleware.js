const {dbRequest} = require("../utils/connection.utils");
const QUERY = require("../utils/query.utils");
const {catchHandler} = require("../utils/handler.utils");
const {throwError} = require("../utils/translations.utils");
const {Logger} = require("./log.middleware");

const checkMenuItemOwner = () => (req, res, next) => {
    const logger = new Logger(req);

    dbRequest(
        logger.addQueryDB(
            QUERY.MENU_ITEM.CHECK_OWNERSHIP_SELECT_BY_CUSTOMER_ID_AND_MENU_ITEM_ID(req.customer.id, req.body.id)
        )
    )
        .then(res => {
            if (!res.length) {
                throwError("MENU_ITEM.ONLY_OWNER_CAN", req);
            }
        })
        .then(() => next())
        .catch(catchHandler({res, logger}))
}

module.exports = {
    checkMenuItemOwner
}