const {dbRequest} = require("../utils");
const QUERY = require("../db/query");
const VALIDATOR = require("../utils/validation");
const {catchHandler, sendHandler} = require("../utils/responce");
const DESCRIPTION = require("../utils/description");

const getFirstCustomer = customers => {
    if (customers.length > 0) {
        const {ID, NAME, EMAIL, PHONE, PASSWORD} = customers[0];
        return {ID, NAME, EMAIL, PHONE, PASSWORD};
    }

    throw new Error('Wrong credentials.');
}

const routes = {
    "name": "Customer",
    "description": "For customers and business owners",
    "routes": [
        {
            "method": "post",
            "url": "/sign-in",
            "description": DESCRIPTION.CUSTOMER.SING_IN,
            callback: function (req, res) {
                const {email, password} = req.body;


                dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password))
                    .then(getFirstCustomer)
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.CUSTOMER.SING_IN, {email, password}))
            }
        },
        {
            "method": "post",
            "url": "/sign-up",
            "description": DESCRIPTION.CUSTOMER.SING_UP,
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
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.CUSTOMER.SING_UP, customer))
            }
        },
        {
            "method": "post",
            "url": "/change-password",
            "description": DESCRIPTION.CUSTOMER.CHANGE_PASSWORD,
            callback: function (req, res) {
                const {password, email, newPassword} = req.body;
                const customer = {password, email, newPassword};

                VALIDATOR.CUSTOMER.CHANGE_PASSWORD(customer)
                    .then(() => dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password)))
                    .then(response => {
                            if (!response.length) {
                                throw new Error('Wrong old password.')
                            }
                        }
                    )
                    .then(() => dbRequest(QUERY.CUSTOMER.UPDATE_PASSWORD(customer)))
                    .then(() => dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, newPassword)))
                    .then(getFirstCustomer)
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.CUSTOMER.CHANGE_PASSWORD, customer))
            }
        }
    ]
}


module.exports = routes;