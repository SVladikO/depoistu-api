const {getParamMessageRequirements, dbRequest} = require("../utils");
const QUERY = require("../db/query");
const VALIDATOR = require("../utils/validation");
const {responseError} = require("../utils/responce");

const routes = {
    "name": "Menu",
    "description": "For menu items.",
    "routes": [
        {
            "method": "get",
            "url": "/menu/:companyId",
            "description": "Get menu by companyId",
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
                    .catch(e => {
                        console.log('Get menu by companyId error', e.message, companyId)
                        responseError(res, 400, e.message);
                    })
            }
        },
        {
            "method": "post",
            "url": "/menu",
            "description": "Create menu item.",
            callback: function (req, res) {
                const {id, category_id, company_id, name, description, cookingTime, price, size, image_url} = req.body;
                const menuItem = {id, category_id, company_id, name, description, cookingTime, price, size, image_url};

                VALIDATOR.MENU_ITEM.CREATE(menuItem)
                    .then(() =>
                        dbRequest(
                            QUERY.MENU_ITEM.INSERT({
                                category_id,
                                company_id,
                                name,
                                description,
                                cookingTime,
                                price,
                                size,
                                image_url
                            })))
                    .then(dbRes => res.send(dbRes))
                    .catch(e => {
                        console.log('Create menu item error', e.message, menuItem)
                        responseError(res, 400, e.message);
                    })
            }
        },
        {
            "method": "put",
            "url": "/menu",
            "description": "Update menu item.",
            callback: function (req, res) {
                const {id, name, description, cookingTime, price, size, image_url} = req.body;
                const menuItem = {id, name, description, cookingTime, price, size, image_url};

                VALIDATOR.MENU_ITEM.UPDATE(menuItem)
                    .then(() => dbRequest(QUERY.MENU_ITEM.UPDATE({
                        id,
                        name,
                        description,
                        cookingTime,
                        price,
                        size,
                        image_url
                    })))
                    .then(() => dbRequest(QUERY.MENU_ITEM.SELECT_BY_ID(id)))
                    .then(updatedMenuItem => res.send(updatedMenuItem))
                    .catch(e => {
                        console.log('Update menuItem error', e.message, menuItem)
                        responseError(res, 400, e.message);
                    })

            }
        },
        {
            "method": "delete",
            "url": "/menu",
            "description": "Delete menu item.",
            callback: function (req, res) {
                const {id} = req.body;

                dbRequest(QUERY.MENU_ITEM.DELETE_BY_MENU_ITEM_ID(id))
                    .then(message => res.send(message))
                    .catch(e => {
                        console.log('Delete menu item error', e.message, id)
                        responseError(res, 400, e.message);
                    })
            }
        },

    ]
}

module.exports = routes;