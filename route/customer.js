const {logRequestDetails, dbRequest} = require("../utils");
const QUERY = require("../db/query");

const routes = {
    "name":"SingIn",
    "description":"Everything about SingIn",
    "routes":[
        {
            "method":"post",
            "url":"/sign-in",
            "description":"Sing in",
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