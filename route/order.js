const {logRequestDetails, dbRequest} = require("../utils");
const QUERY = require("../db/query");

module.exports = function (app) {
    app.post('/place-order', function (req, res) {
        logRequestDetails(req)

        const {guest_id, company_id, order_details} = req.body.order;

        console.log('order_details', order_details);

        dbRequest(
            QUERY.HISTORY.INSERT(guest_id, company_id, JSON.stringify(order_details), new Date().getTime()),
            dbRes => res.send(true),
            dbRes => res.send(dbRes)
        );
    })

}