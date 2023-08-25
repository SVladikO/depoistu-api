const {dbRequest} = require("../utils/connection");
const QUERY = require("../utils/query");
const {VALIDATOR, VALIDATION} = require("../utils/validation");
const {catchHandler, sendHandler} = require("../utils/handler");
const {DESCRIPTION, PERMISSION} = require("../utils/description");
const {verifyToken} = require("../middleware/auth");
const {checkMenuItemOwner} = require("../middleware/menu_item");

/**
 * The problem started from DB. IS_VISIBLE field is BOOLEAN type but save 0 / 1 . We should save only these values.
 *
 * @param value
 * @return {number}
 */
const validateIsVisible = value => +(!!value);

const getParamMessageRequirements = (paramName, requiredType = 'number') => {
    const message = `Error: Param ${paramName} should be ${requiredType}`;
    console.log('???? ' + message)
    return message;
}

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
                    .then(convertMenuItemFields)
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
                    .then(convertMenuItemFields)
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.GET_BY_COMPANY_ID, companyId))
            }]
        },
        {
            method: "post",
            url: "/menu",
            url_example: "/menu",
            details: {
                ...PERMISSION(),
                bodyValidation: true,
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type,
                    name: VALIDATION.MENU_ITEM.name.type,
                    categoryId: VALIDATION.MENU_ITEM.categoryId.type,
                    companyId: VALIDATION.MENU_ITEM.companyId.type,
                    description: VALIDATION.MENU_ITEM.description.type,
                    cookingTime: VALIDATION.MENU_ITEM.cookingTime.type,
                    price: VALIDATION.MENU_ITEM.price.type,
                    size: VALIDATION.MENU_ITEM.size.type,
                    imageUrl: VALIDATION.MENU_ITEM.imageUrl.type,
                }
            },
            "description": DESCRIPTION.MENU_ITEM.CREATE,
            callbacks: [verifyToken, function (req, res) {
                const {id, categoryId, companyId, name, description, cookingTime, price, size, imageUrl} = req.body;
                const menuItem = {
                    id,
                    categoryId,
                    companyId,
                    name,
                    description,
                    cookingTime,
                    price,
                    size,
                    imageUrl,
                    isVisible: 1
                };

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
                ...PERMISSION(['4. Check ownership.']),
                bodyValidation: true,
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type,
                    categoryId: VALIDATION.MENU_ITEM.categoryId.type,
                    name: VALIDATION.MENU_ITEM.name.type,
                    description: VALIDATION.MENU_ITEM.description.type,
                    cookingTime: VALIDATION.MENU_ITEM.cookingTime.type,
                    price: VALIDATION.MENU_ITEM.price.type,
                    size: VALIDATION.MENU_ITEM.size.type,
                    imageUrl: VALIDATION.MENU_ITEM.imageUrl.type,
                }
            },
            "description": DESCRIPTION.MENU_ITEM.UPDATE,
            callbacks: [
                verifyToken,
                checkMenuItemOwner('Only owner can update menu item'),
                function (req, res) {
                    const {id, name, categoryId, description, cookingTime, price, size, imageUrl} = req.body;
                    const menuItem = {id, name, categoryId, description, cookingTime, price, size, imageUrl};

                    VALIDATOR.MENU_ITEM.UPDATE(menuItem)
                        .then(() => dbRequest(QUERY.MENU_ITEM.UPDATE(menuItem)))
                        .then(() => dbRequest(QUERY.MENU_ITEM.SELECT_BY_ID(id)))
                        .then(convertMenuItemFields)
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
                ...PERMISSION(['4. Check ownership.']),
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type,
                    isVisible: VALIDATION.MENU_ITEM.isVisible.type,
                }
            },
            callbacks: [
                verifyToken,
                checkMenuItemOwner('Only owner can update menu item visibility'),
                function (req, res) {
                    const {id, companyId, isVisible} = req.body;
                    const menuItem = {id, companyId, isVisible: validateIsVisible(isVisible)};

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
                ...PERMISSION(['4. Check ownership.']),
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type
                }
            },
            description: DESCRIPTION.MENU_ITEM.DELETE,
            callbacks: [
                verifyToken,
                checkMenuItemOwner('Only owner can delete menu item'),
                function (req, res) {
                    const {id} = req.body;

                    dbRequest(QUERY.MENU_ITEM.DELETE_BY_MENU_ITEM_ID(id))
                        .then(sendHandler(res))
                        .catch(catchHandler(res, DESCRIPTION.MENU_ITEM.DELETE, id))
                }]
        },

    ]
}


function convertMenuItemFields(res) {
    return res.map(mi => {
        const {
            ID: id,
            CATEGORY_ID: categoryId,
            COMPANY_ID: companyId,
            NAME: name,
            IS_VISIBLE: isVisible,
            DESCRIPTION: description,
            COOKING_TIME: cookingTime,
            PRICE: price,
            SIZE: size,
            IMAGE_URL: imageUrl,
        } = mi;

        return {
            id,
            categoryId,
            companyId,
            name,
            isVisible,
            description,
            cookingTime,
            price,
            size,
            imageUrl,
        }
    })
}

module.exports = routes;