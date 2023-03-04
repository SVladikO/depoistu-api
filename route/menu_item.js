const {logRequestDetails, getParamMessageRequirements, dbRequest} = require("../utils");
const QUERY = require("../db/query");

const routes = {
    "name":"Menu",
    "description":"For menu items.",
    "routes":[
        {
            "method":"get",
            "url":"/menu/:companyId",
            "description":"Get company menu.",
            callback: function (req, res) {
                logRequestDetails(req)

                const {companyId} = req.params;

                if (isNaN(companyId)) {
                    res.send(getParamMessageRequirements('companyId',));
                    return;
                }

                dbRequest(QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID(companyId), dbRes => res.send(dbRes));
            }
        },
        {
            "method":"get",
            "url":"/categories/:companyId",
            "description":"Get menu categories by company id.",
            callback: function (req, res) {
                logRequestDetails(req)
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
                    dbRes => res.send(dbRes)
                );
            }
        },
        {
            "method":"get",
            "url":"/menu/:companyId/:categoryId",
            "description":"Get menu for specific company and category.",
            callback: function (req, res) {
                logRequestDetails(req)
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
                    dbRes => res.send(dbRes)
                );
            }
        }
    ]
}

module.exports = routes;