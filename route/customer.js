const {dbRequest} = require("../utils");
const QUERY = require("../db/query");
const VALIDATOR = require("../utils/validation");
const {responseError} = require("../utils/responce");

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
        },
        {
            "method": "post",
            "url": "/sign-up",
            "description": "User sing up.",
            callback: function (req, res) {
                const {name, phone, password, email} = req.body;
                const join_date = new Date().getTime();
                const customer = {name, phone, password, email, join_date};

                VALIDATOR.CUSTOMER.SING_UP(customer)
                    .then(e => {
                        dbRequest(
                            // Check email duplication
                            QUERY.CUSTOMER.SELECT_BY_EMAIL(email),
                            message => {
                                if (message.length) {
                                    const errorMessage = 'This email already used.';
                                    console.log('Sing up.', errorMessage, email)
                                    res.status(400).send({message: errorMessage})
                                    return;
                                }

                                console.log('Sing up. ', customer);

                                dbRequest(
                                    QUERY.CUSTOMER.INSERT(customer),
                                    dbRes => res.send(dbRes),
                                    errorMessage => res.send(errorMessage)
                                );
                            },
                            errorMessage => res.send(errorMessage)
                        )
                    })
                    .catch(e => {
                        console.log('Sing up validation error', e.message, customer)
                        responseError(res, 400, e.message);
                    })
            }
        }
    ]
}


module.exports = routes;