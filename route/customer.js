const {dbRequest} = require("../utils");
const QUERY = require("../db/query");
const VALIDATOR = require("../utils/validation");
const {responseError} = require("../utils/responce");

const getFirstCustomer = customers => {
    if (customers.length > 0) {
        const {ID, NAME, EMAIL, PHONE} = customers[0];

        return {ID, NAME, EMAIL, PHONE};
    }

    throw new Error('Wrong credentials.');
}

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


                dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password))
                    .then(getFirstCustomer)
                    .then(customer => res.send(customer))
                    .catch(e => {
                        console.log('Sing up error', e.message, customer)
                        responseError(res, 400, e.message);
                    })
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
                    .then(() => dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL(email)))
                    .then(response => {
                            if (response.length) {
                                throw new Error('This email is already used.')
                            }
                        }
                    )
                    .then(() => dbRequest(QUERY.CUSTOMER.INSERT(customer)))
                    .then(() => dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password)))
                    .then(getFirstCustomer)
                    .then(customer => res.send(customer))
                    .catch(e => {
                        console.log('Sing up error', e.message, customer)
                        responseError(res, 400, e.message);
                    })
            }
        }
    ]
}


module.exports = routes;