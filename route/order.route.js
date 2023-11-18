const {dbRequest} = require("../utils/connection.utils");
const QUERY = require("../utils/query.utils");

const routes = {
    "name": "Order",
    "description": "History of all user orders.",
    "routes": [
        {
            "method": "post",
            "url": "/order",
            "description": "Save orders in db",
            callbacks: [ function (req, res) {
                const {customer_id, company_id, order_details} = req.body.order;

                console.log('order_details', order_details);

                dbRequest(
                    QUERY.HISTORY.INSERT(customer_id, company_id, JSON.stringify(order_details), new Date().getTime()),
                    () => res.send(true),
                    errorMessage => res.send(errorMessage)
                );
            }]
        }
    ]
}

module.exports = routes;