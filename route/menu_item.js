const {getParamMessageRequirements, dbRequest} = require("../utils");
const QUERY = require("../db/query");

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
        {
            "method": "get",
            "url": "/menu/categories/:companyId",
            "description": "Get menu categories by company id.",
            callback: function (req, res) {
                const {companyId} = req.params;

                if (isNaN(companyId)) {
                    res.send(getParamMessageRequirements('companyId'))
                    return;
                }

                dbRequest(
                    QUERY.MENU_ITEM.SELECT_CATEGORY_ID_BY_COMPANY_ID(companyId),
                    dbRes => {
                        let result = [...new Set(dbRes.map(v => v.category_id))]
                        res.send(result)
                    },
                    errorMessage => res.send(errorMessage)
                );
            }
        },
        {
            "method": "get",
            "url": "/menu/:companyId/:categoryId",
            "description": "Get menu for specific company and category.",
            callback: function (req, res) {
                const {companyId, categoryId} = req.params;

                if (isNaN(companyId)) {
                    res.send(getParamMessageRequirements('companyId'))
                    return;
                }

                if (isNaN(categoryId)) {
                    res.send(getParamMessageRequirements('categoryId'))
                    return;
                }

                dbRequest(
                    QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID(companyId, categoryId),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage)
                );
            }
        },
        {
            "method": "post",
            "url": "/menu",
            "description": "Create menu item.",
            callback: function (req, res) {
                const {category_id, company_id, name, description, cooking_time, price, size, image_url} = req.body;

                dbRequest(
                    QUERY.MENU_ITEM.INSERT(category_id, company_id, name, description, cooking_time, price, size, image_url),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage)
                );
            }
            // {
            //     "category_id": 1,
            //     "company_id": 111,
            //     "name": "Kasha",
            //     "description": "the best kasha ever",
            //     "cooking_time": "10",
            //     "price": "100",
            //     "size": "110",
            //     "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Havregr%C3%B8d_p%C3%A5_vand.JPG/280px-Havregr%C3%B8d_p%C3%A5_vand.JPG"
            // }
        }
    ]
}

module.exports = routes;