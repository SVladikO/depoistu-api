const {dbRequest} = require("../utils");
const QUERY = require("../db/query");

const routes = {
    "name": "Customer",
    "description": "For customer and business owners.",
    "routes": [
        {
            "method": "post",
            "url": "/sign-in",
            "description": "User sing in.",
            callback: function (req, res) {
                const {email, password} = req.body;

                dbRequest(
                    QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password),
                    dbRes => res.send(dbRes),
                    errorMessage => res.send(errorMessage)
                );
            }
        }
    ]
}


module.exports = routes;