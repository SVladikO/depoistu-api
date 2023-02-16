const {logRequestDetails, dbRequest} = require("../utils");
const QUERY = require("../db/query");

module.exports = function (app) {
    app.post('/sign-in', function (req, res) {
        logRequestDetails(req)

        const {email, password} = req.body;

        dbRequest(
            QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password),
            dbRes => res.send(dbRes),
            dbRes => res.send(dbRes)
        );
    })

}