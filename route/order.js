const {logRequestDetails, dbRequest} = require("../utils");
const QUERY = require("../db/query");

const routes = {
    "name":"Order",
    "description":"Everything about Order",
    "routes":[
        {
            "method":"post",
            "url":"/place-order",
            "description":"Save orders in db",
            callback: function (req, res) {
                logRequestDetails(req)

                const {customer_id, company_id, order_details} = req.body.order;

                console.log('order_details', order_details);

                dbRequest(
                    QUERY.HISTORY.INSERT(customer_id, company_id, JSON.stringify(order_details), new Date().getTime()),
                    () => res.send(true),
                    dbRes => res.send(dbRes)
                );
            }
        }
    ]
}

module.exports = routes;