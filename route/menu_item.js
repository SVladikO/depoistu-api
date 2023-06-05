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
            "description": "Get company menu.",
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

                dbRequest(QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID(companyId),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage));
            }
        },
        // {
        //     "method": "get",
        //     "url": "/menu/:companyId/:categoryId",
        //     "description": "Get menu for specific company and category.",
        //     callback: function (req, res) {
        //         const {companyId, categoryId} = req.params;
        //
        //         if (isNaN(companyId)) {
        //             res.send(getParamMessageRequirements('companyId'))
        //             return;
        //         }
        //
        //         if (isNaN(categoryId)) {
        //             res.send(getParamMessageRequirements('categoryId'))
        //             return;
        //         }
        //
        //         dbRequest(
        //             QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID(companyId, categoryId),
        //             dbRes => res.send(dbRes),
        //             errorMessage => res.send(errorMessage)
        //         );
        //     }
        // },
        {
            "method": "post",
            "url": "/menu",
            "description": "Create menu item.",
            callback: function (req, res) {
                const {id, category_id, company_id, name, description, cookingTime, price, size, image_url} = req.body;
                const menuItem = {id, category_id, company_id, name, description, cookingTime, price, size, image_url};

                VALIDATOR.MENU_ITEM.CREATE(menuItem)
                    .then(() => {
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
                            }),
                            dbRes => res.send(dbRes),
                            errorMessage => res.send(errorMessage)
                        );
                    })
                    .catch(e => {
                        console.log('Update menuItem validation error', e.message, menuItem)
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
                console.log(8888, menuItem);
                VALIDATOR.MENU_ITEM.UPDATE(menuItem)
                    .then(() => {
                        dbRequest(
                            QUERY.MENU_ITEM.UPDATE({id, name, description, cookingTime, price, size, image_url}),
                            () => {
                                dbRequest(
                                    QUERY.MENU_ITEM.SELECT_BY_ID(id),
                                    dbRes => res.send(dbRes),
                                    errorMessage => res.send(errorMessage)
                                );
                            },
                            errorMessage => res.send(errorMessage)
                        );
                    })
                    .catch(e => {
                        console.log('Update menuItem validation error', e.message, menuItem)
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

                dbRequest(
                    QUERY.MENU_ITEM.DELETE_BY_MENU_ITEM_ID(id),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage)
                );
            }
        },

    ]
}

module.exports = routes;