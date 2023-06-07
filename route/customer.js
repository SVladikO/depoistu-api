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
                    customers => {
                        if (customers.length > 0) {
                            res.send(customers[0])
                            console.log('Sing in. successfully.', email, password)
                            return;
                        }

                        const errorMessage = 'Wrong credentials.';

                        console.log('Sing in.', errorMessage, email, password)
                        res.status(400).send({message: errorMessage})
                    },
                    errorMessage => res.send(errorMessage)
                );
            }
        }
    ]
}


module.exports = routes;