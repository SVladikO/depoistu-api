const {logRequestDetails, dbRequest} = require("../utils");
const QUERY = require("../db/query");

const routes = {
    "name":"Customer",
    "description":"For users(guests) and business owners.",
    "routes":[
        {
            "method":"post",
            "url":"/sign-in",
            "description":"User sing in.",
            callback: function (req, res) {
                logRequestDetails(req)

                const {email, password} = req.body;

                dbRequest(
                    QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password),
                    dbRes => res.send(dbRes),
                    dbRes => res.send(dbRes)
                );
            }
        }
    ]
}


module.exports = routes;