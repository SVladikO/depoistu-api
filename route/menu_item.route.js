const {verifyToken} = require("../middleware/auth.middleware");
const {checkCompanyOwner} = require("../middleware/company.middleware");
const {checkMenuItemOwner} = require("../middleware/menu_item.middleware");

const QUERY = require("../utils/query.utils");
const {dbRequest} = require("../utils/connection.utils");
const {VALIDATOR, VALIDATION} = require("../utils/validation.utils");
const {resolveError, throwError} = require("../utils/error.utils");
const {catchHandler, sendHandler} = require("../utils/handler.utils");
const {DESCRIPTION, PERMISSION} = require("../utils/description.utils");
const {Logger} = require("../middleware/log.middleware");

/**
 * The problem started from DB. IS_VISIBLE field is BOOLEAN type but save 0 / 1 . We should save only these values.
 *
 * @param value
 * @return {number}
 */
const convertIsVisible = value => +(!!value);

const getParamMessageRequirements = (paramName, requiredType = 'number') => `Error: Param ${paramName} should be ${requiredType}`;

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
                const logger = new Logger(req);
                logger.addLog(DESCRIPTION.MENU_ITEM.GET_BY_COMPANY_ID)

                const companyId = +req.params.companyId;

                if (!companyId) {
                    return catchHandler({
                        res,
                        logger,
                        status: 400
                    })(resolveError("MENU_ITEM.COMPANY_ID_REQUIRED", req))
                }

                if (isNaN(companyId)) {
                    return catchHandler({
                        res,
                        logger,
                        status: 400,
                    })({message: getParamMessageRequirements('companyId')})
                }

                dbRequest(logger.addQueryDB(QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID(companyId)))
                    .then(convertMenuItemFields)
                    .then(sendHandler(res, logger))
                    .catch(catchHandler({res, logger}));
            }]
        },
        {
            method: "get",
            url: "/menu/only-visible/:companyId",
            url_example: "/menu/only-visible/1",
            description: DESCRIPTION.MENU_ITEM.GET_ONLY_VISIBLE_BY_COMPANY_ID,
            callbacks: [
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.MENU_ITEM.GET_ONLY_VISIBLE_BY_COMPANY_ID)

                    const companyId = +req.params.companyId;

                    if (!companyId) {
                        return catchHandler({res, logger, status: 400})(resolveError("MENU_ITEM.COMPANY_ID_REQUIRED", req))
                    }

                    if (isNaN(companyId)) {
                        return catchHandler({res, logger, status: 400})({message: getParamMessageRequirements('companyId')})
                    }

                    dbRequest(logger.addQueryDB(QUERY.MENU_ITEM.SELECT_ALL_ONLY_VISIABLE_BY_COMPANY_ID(companyId)))
                        .then(res => {
                            if (!res.length) {
                                throwError("COMPANY.NO_MENU", req);
                            }

                            return res;
                        })
                        .then(convertMenuItemFields)
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
                }]
        },
        {
            method: "post",
            url: "/menu",
            url_example: "/menu",
            "description": DESCRIPTION.MENU_ITEM.CREATE,
            details: {
                ...PERMISSION(['4. Check company ownership. Customer can create menu items to company which he own.']),
                bodyValidation: true,
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type,
                    name: VALIDATION.MENU_ITEM.name.type,
                    category_id: VALIDATION.MENU_ITEM.category_id.type,
                    company_id: VALIDATION.MENU_ITEM.company_id.type,
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
            callbacks: [
                verifyToken,
                checkCompanyOwner(req => req.body.company_id),
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.MENU_ITEM.CREATE)

                    const menuItem = {...req.body, isVisible: 1};

                    VALIDATOR.MENU_ITEM.CREATE(menuItem)
                        .then(() => dbRequest(logger.addQueryDB(QUERY.MENU_ITEM.INSERT(menuItem))))
                        // We still need this select for FE
                        .then(res => dbRequest(logger.addQueryDB(QUERY.MENU_ITEM.SELECT_BY_ID(res.insertId))))
                        .then(convertMenuItemFields)
                        .then(res => res[0])
                        .then(sendHandler(res, logger, 201))
                        .catch(catchHandler({res, logger}));
                }]
        },
        {
            method: "put",
            url: "/menu",
            url_example: "/menu",
            "description": DESCRIPTION.MENU_ITEM.UPDATE,
            details: {
                ...PERMISSION(['4. Check ownership.']),
                bodyValidation: true,
                requestBody: {
                    id: VALIDATION.MENU_ITEM.id.type,
                    category_id: VALIDATION.MENU_ITEM.category_id.type,
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
            callbacks: [
                verifyToken,
                checkCompanyOwner(req => req.body.company_id),
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.MENU_ITEM.UPDATE)

                    const menuItem = req.body;

                    VALIDATOR.MENU_ITEM.UPDATE(menuItem)
                        .then(() => dbRequest(logger.addQueryDB(QUERY.MENU_ITEM.UPDATE(menuItem))))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
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
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.MENU_ITEM.UPDATE_IS_VISIBLE)
                    const {id, isVisible} = req.body;
                    const menuItem = {id, isVisible: convertIsVisible(isVisible)};

                    VALIDATOR.MENU_ITEM.UPDATE_IS_VISIBLE(menuItem)
                        .then(() => dbRequest(logger.addQueryDB(QUERY.MENU_ITEM.UPDATE_IS_VISIBLE(menuItem))))
                        .then(() => ({isVisible: isVisible}))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
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
                    const logger = new Logger(req)
                    logger.addLog(DESCRIPTION.MENU_ITEM.DELETE)

                    const {id} = req.body;

                    dbRequest(logger.addQueryDB(QUERY.MENU_ITEM.DELETE_BY_MENU_ITEM_ID(id)))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}))
                }]
        }
    ]
}


function convertMenuItemFields(res) {

    return res.map(mi => {
        const {
            ID: id,
            CATEGORY_ID: category_id,
            COMPANY_ID: company_id,
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
            category_id,
            company_id,
            name,
            isVisible,
            description,
            size_1: size_1,
            size_2: size_2,
            size_3: size_3,
            price_1: +price_1,
            price_2: +price_2,
            price_3: +price_3,
            imageUrl,
        }
    })
}

module.exports = routes;