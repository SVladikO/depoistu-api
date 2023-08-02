const {getParamMessageRequirements, dbRequest} = require("../utils");
const QUERY = require("../db/query");
const VALIDATOR = require("../utils/validation");
const {catchHandler, sendHandler} = require("../utils/responce");
const DESCRIPTION = require("../utils/description");
const {verifyToken} = require("../middleware/auth");

const routes = {
    "name": "Menu",
    "description": "For menu items.",
    "routes": [
        {
            "method": "get",
            "url": "/menu/:companyId",
            "description": DESCRIPTION.MENU_ITEM.GET_BY_COMPANY_ID,
            callbacks: [ function (req, res) {
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
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.GET_BY_COMPANY_ID, companyId))
            }]
        },
        {
            "method": "post",
            "url": "/menu",
            "description": DESCRIPTION.MENU_ITEM.CREATE,
            callbacks: [verifyToken, function (req, res) {
                const {id, category_id, company_id, name, description, cookingTime, price, size, image_url} = req.body;
                const menuItem = {id, category_id, company_id, name, description, cookingTime, price, size, image_url};

                VALIDATOR.MENU_ITEM.CREATE(menuItem)
                    .then(() => dbRequest(QUERY.MENU_ITEM.INSERT(menuItem)))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.CREATE, menuItem))
            }]
        },
        {
            "method": "put",
            "url": "/menu",
            "description": DESCRIPTION.MENU_ITEM.UPDATE,
            callbacks: [verifyToken, function (req, res) {
                const {id, name, category_id, description, cookingTime, price, size, image_url} = req.body;
                const menuItem = {id, name, category_id, description, cookingTime, price, size, image_url};

                VALIDATOR.MENU_ITEM.UPDATE(menuItem)
                    .then(() => dbRequest(QUERY.MENU_ITEM.UPDATE(menuItem)))
                    .then(() => dbRequest(QUERY.MENU_ITEM.SELECT_BY_ID(id)))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.UPDATE, id))

            }]
        },
        {
            "method": "put",
            "url": "/menu/visible",
            "description": DESCRIPTION.MENU_ITEM.UPDATE_IS_VISIBLE,
            callbacks: [verifyToken, function (req, res) {
                const {id, is_visible} = req.body;
                const menuItem = {id, is_visible};
                console.log(1111, id, is_visible)
                VALIDATOR.MENU_ITEM.UPDATE_IS_VISIBLE(menuItem)
                    .then(() => dbRequest(QUERY.MENU_ITEM.UPDATE_IS_VISIBLE(menuItem)))
                    .then(() => ({success: true}))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.UPDATE, id))
            }]
        },
        {
            "method": "delete",
            "url": "/menu",
            "description": DESCRIPTION.MENU_ITEM.DELETE,
            callbacks: [verifyToken, function (req, res) {
                const {id} = req.body;

                dbRequest(QUERY.MENU_ITEM.DELETE_BY_MENU_ITEM_ID(id))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.DELETE, id))
            }]
        },

    ]
}

module.exports = routes;