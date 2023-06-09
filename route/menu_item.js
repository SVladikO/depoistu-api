const {getParamMessageRequirements, dbRequest} = require("../utils");
const QUERY = require("../db/query");
const VALIDATOR = require("../utils/validation");
const {catchHandler} = require("../utils/responce");
const DESCRIPTION = require("../utils/description");

const routes = {
    "name": "Menu",
    "description": "For menu items.",
    "routes": [
        {
            "method": "get",
            "url": "/menu/:companyId",
            "description": DESCRIPTION.MENU_ITEM.GET_BY_COMPANY_ID,
            callback: function (req, res) {
                const companyId = +req.params.companyId;

                if (!companyId) {
                    return res.status(400).send({
                        message: 'Bad request.'
                    })
                }

                if (isNaN(companyId)) {
                    res.send(getParamMessageRequirements('companyId',));
                    return;
                }

                dbRequest(QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID(companyId))
                    .then(dbRes => res.send(dbRes))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.GET_BY_COMPANY_ID, companyId))
            }
        },
        {
            "method": "post",
            "url": "/menu",
            "description": DESCRIPTION.MENU_ITEM.CREATE,
            callback: function (req, res) {
                const {id, category_id, company_id, name, description, cookingTime, price, size, image_url} = req.body;
                const menuItem = {id, category_id, company_id, name, description, cookingTime, price, size, image_url};

                VALIDATOR.MENU_ITEM.CREATE(menuItem)
                    .then(() => dbRequest(QUERY.MENU_ITEM.INSERT(menuItem)))
                    .then(dbRes => res.send(dbRes))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.CREATE, menuItem))
            }
        },
        {
            "method": "put",
            "url": "/menu",
            "description": DESCRIPTION.MENU_ITEM.UPDATE,
            callback: function (req, res) {
                const {id, name, description, cookingTime, price, size, image_url} = req.body;
                const menuItem = {id, name, description, cookingTime, price, size, image_url};

                VALIDATOR.MENU_ITEM.UPDATE(menuItem)
                    .then(() => dbRequest(QUERY.MENU_ITEM.UPDATE(menuItem)))
                    .then(() => dbRequest(QUERY.MENU_ITEM.SELECT_BY_ID(id)))
                    .then(updatedMenuItem => res.send(updatedMenuItem))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.UPDATE, id))

            }
        },
        {
            "method": "delete",
            "url": "/menu",
            "description": DESCRIPTION.MENU_ITEM.DELETE,
            callback: function (req, res) {
                const {id} = req.body;

                dbRequest(QUERY.MENU_ITEM.DELETE_BY_MENU_ITEM_ID(id))
                    .then(message => res.send(message))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.DELETE, id))
            }
        },

    ]
}

module.exports = routes;