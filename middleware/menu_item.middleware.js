const {dbRequest} = require("../utils/connection.utils");
const QUERY = require("../utils/query.utils");
const {catchHandler} = require("../utils/handler.utils");
const {throwError} = require("../utils/translations.utils");
const {Logger} = require("./log.middleware");

const checkMenuItemOwner = () => (req, res, next) => {
    const logger = new Logger(req);
    console.log({id: req.customer.id, menuItemId: req.body.id})
    dbRequest(
        logger.addQueryDB(
            QUERY.MENU_ITEM.CHECK_OWNERSHIP_SELECT_BY_CUSTOMER_ID_AND_MENU_ITEM_ID(req.customer.id, req.body.id)
        )
    )
        .then(res => {
            console.log(22, res.length);
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