const {verifyToken} = require("../middleware/auth.middleware");
const {checkCompanyOwner} = require("../middleware/company.middleware");
const {checkMenuItemOwner} = require("../middleware/menu_item.middleware");

const QUERY = require("../utils/query.utils");
const {dbRequest} = require("../utils/connection.utils");
const {VALIDATOR, VALIDATION} = require("../utils/validation.utils");
const {TRANSLATION, resolve} = require("../utils/translations.utils");
const {catchHandler, sendHandler} = require("../utils/handler.utils");
const {DESCRIPTION, PERMISSION} = require("../utils/description.utils");
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
                        errorMessage: resolve(TRANSLATION.MENU_ITEM.COMPANY_ID_REQUIRED, req)
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
                        errorMessage: resolve(TRANSLATION.MENU_ITEM.COMPANY_ID_REQUIRED, req)
                    })
                }

                if (isNaN(companyId)) {
                    res.send(getParamMessageRequirements('companyId',));
                    return;
                }

                dbRequest(QUERY.MENU_ITEM.SELECT_ALL_ONLY_VISIABLE_BY_COMPANY_ID(companyId))
                    .then(res => {
                        if (!res.length) {
                            throw new Error(resolve(TRANSLATION.COMPANY.NO_MENU, req));
                        }

                        return res;
                    })
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
                ...PERMISSION(['4. Check company ownership. Customer can create menu items to company which he own.']),
                bodyValidation: true,
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type,
                    name: VALIDATION.MENU_ITEM.name.type,
                    categoryId: VALIDATION.MENU_ITEM.categoryId.type,
                    companyId: VALIDATION.MENU_ITEM.companyId.type,
                    description: VALIDATION.MENU_ITEM.description.type,
                    size_1: VALIDATION.MENU_ITEM.size_1.type,
                    price_1: VALIDATION.MENU_ITEM.price_1.type,
                    size_2: VALIDATION.MENU_ITEM.size_2.type,
                    price_2: VALIDATION.MENU_ITEM.price_2.type,
                    size_3: VALIDATION.MENU_ITEM.size_3.type,
                    price_3: VALIDATION.MENU_ITEM.price_3.type,
                    imageUrl: VALIDATION.MENU_ITEM.imageUrl.type,
                }
            },
            "description": DESCRIPTION.MENU_ITEM.CREATE,
            callbacks: [
                verifyToken,
                checkCompanyOwner,
                function (req, res) {
                const {
                    id,
                    categoryId,
                    companyId,
                    name,
                    description,
                    size_1,
                    price_1,
                    size_2,
                    price_2,
                    size_3,
                    price_3,
                    imageUrl,
                } = req.body;
                const menuItem = {
                    id,
                    categoryId,
                    companyId,
                    name,
                    description,
                    size_1,
                    price_1,
                    size_2,
                    price_2,
                    size_3,
                    price_3,
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
                    size_1: VALIDATION.MENU_ITEM.size_1.type,
                    price_1: VALIDATION.MENU_ITEM.price_1.type,
                    size_2: VALIDATION.MENU_ITEM.size_2.type,
                    price_2: VALIDATION.MENU_ITEM.price_2.type,
                    size_3: VALIDATION.MENU_ITEM.size_3.type,
                    price_3: VALIDATION.MENU_ITEM.price_3.type,
                    imageUrl: VALIDATION.MENU_ITEM.imageUrl.type,
                }
            },
            "description": DESCRIPTION.MENU_ITEM.UPDATE,
            callbacks: [
                verifyToken,
                checkMenuItemOwner(),
                function (req, res) {
                    const {
                        id,
                        name,
                        categoryId,
                        description,
                        size_1,
                        price_1,
                        size_2,
                        price_2,
                        size_3,
                        price_3,
                        imageUrl
                    } = req.body;

                    const menuItem = {
                        id,
                        name,
                        categoryId,
                        description,
                        size_1,
                        price_1,
                        size_2,
                        price_2,
                        size_3,
                        price_3,
                        imageUrl
                    };

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
                checkMenuItemOwner(),
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
                checkMenuItemOwner(),
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
            SIZE_1: size_1,
            PRICE_1: price_1,
            SIZE_2: size_2,
            PRICE_2: price_2,
            SIZE_3: size_3,
            PRICE_3: price_3,
            IMAGE_URL: imageUrl,
        } = mi;
        return {
            id,
            categoryId,
            companyId,
            name,
            isVisible,
            description,
            size_1,
            price_1,
            size_2,
            price_2,
            size_3,
            price_3,
            imageUrl,
        }
    })
}

module.exports = routes;