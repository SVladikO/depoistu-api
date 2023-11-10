const {dbRequest} = require("../utils/connection");
const QUERY = require("../utils/query");
const {catchHandler} = require("../utils/handler");
const {resolve, TRANSLATION} = require("../utils/translations");

const checkMenuItemOwner = message => (req, res, next) => {
    const customerId = req.customer.id;
    const {id: menuItemId} = req.body;

    dbRequest(QUERY.MENU_ITEM.CHECK_OWNERSHIP_SELECT_BY_CUSTOMER_ID_AND_MENU_ITEM_ID(customerId, menuItemId))
        .then(res => {
            if (!res.length) {
                throw new Error(resolve(TRANSLATION.MENU_ITEM.ONLY_OWNER_CAN, req));
            }
        })
        .then(() => next())
        .catch(catchHandler(res, message))
}

module.exports = {
    checkMenuItemOwner
}