const {getParamMessageRequirements, dbRequest} = require("../utils");
const QUERY = require("../db/query");
const {VALIDATOR, VALIDATION} = require("../utils/validation");
const {catchHandler, sendHandler} = require("../utils/responce");
const {DESCRIPTION, PERMISSION} = require("../utils/description");
const {verifyToken} = require("../middleware/auth");

const routes = {
    "name": "Menu",
    "description": "For menu items.",
    "routes": [
        {
            method: "get",
            url: "/menu/:companyId",
            url_example: "/menu/1",
            description: DESCRIPTION.MENU_ITEM.GET_BY_COMPANY_ID,
            callbacks: [function (req, res) {
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
            method: "get",
            url: "/menu/only-visible/:companyId",
            url_example: "/menu/only-visible/1",
            description: DESCRIPTION.MENU_ITEM.GET_ONLY_VISIBLE_BY_COMPANY_ID,
            callbacks: [function (req, res) {
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

                dbRequest(QUERY.MENU_ITEM.SELECT_ALL_ONLY_VISIABLE_BY_COMPANY_ID(companyId))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.GET_BY_COMPANY_ID, companyId))
            }]
        },
        {
            method: "post",
            url: "/menu",
            url_example: "/menu",
            details: {
                ...PERMISSION,
                validation: true,
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type,
                    name: VALIDATION.MENU_ITEM.name.type,
                    category_id: VALIDATION.MENU_ITEM.category_id.type,
                    company_id: VALIDATION.MENU_ITEM.company_id.type,
                    description: VALIDATION.MENU_ITEM.description.type,
                    cookingTime: VALIDATION.MENU_ITEM.cookingTime.type,
                    price: VALIDATION.MENU_ITEM.price.type,
                    size: VALIDATION.MENU_ITEM.size.type,
                    image_url: VALIDATION.MENU_ITEM.image_url.type,
                }
            },
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
            method: "put",
            url: "/menu",
            url_example: "/menu",
            details: {
                ...PERMISSION,
                validation: true,
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type,
                    category_id: VALIDATION.MENU_ITEM.category_id.type,
                    name: VALIDATION.MENU_ITEM.name.type,
                    description: VALIDATION.MENU_ITEM.description.type,
                    cookingTime: VALIDATION.MENU_ITEM.cookingTime.type,
                    price: VALIDATION.MENU_ITEM.price.type,
                    size: VALIDATION.MENU_ITEM.size.type,
                    image_url: VALIDATION.MENU_ITEM.image_url.type,
                }
            },
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
            method: "put",
            url: "/menu/visible",
            url_example: "/menu/visible",
            description: DESCRIPTION.MENU_ITEM.UPDATE_IS_VISIBLE,
            details: {
                ...PERMISSION,
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type,
                    is_visible: VALIDATION.MENU_ITEM.is_visible.type,
                }
            },
            callbacks: [verifyToken, function (req, res) {
                const {id, is_visible} = req.body;
                const menuItem = {id, is_visible};
                VALIDATOR.MENU_ITEM.UPDATE_IS_VISIBLE(menuItem)
                    .then(() => dbRequest(QUERY.MENU_ITEM.UPDATE_IS_VISIBLE(menuItem)))
                    .then(() => ({success: true}))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.UPDATE, id))
            }]
        },
        {
            method: "delete",
            url: "/menu",
            url_example: "/menu",
            details: {
                ...PERMISSION,
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type
                }
            },
            description: DESCRIPTION.MENU_ITEM.DELETE,
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