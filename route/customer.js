const {dbRequest} = require("../utils");
const QUERY = require("../db/query");
const {VALIDATOR, VALIDATION} = require("../utils/validation");
const {catchHandler, sendHandler} = require("../utils/responce");
const {DESCRIPTION} = require("../utils/description");
const {Token} = require("../middleware/auth");

const getFirstCustomer = customers => {
    if (customers.length > 0) {
        const {ID, NAME, EMAIL, PHONE, PASSWORD} = customers[0];
        return {ID, NAME, EMAIL, PHONE, PASSWORD};
    }

    throw new Error('Wrong credentials.');
}

const addToken = customer => {
    const {EMAIL, PASSWORD} = customer;
    const token = Token.encode({EMAIL, PASSWORD});

    return {...customer, token};
}

const routes = {
    name: "Customer",
    description: "For customers and business owners",
    routes: [
        {
            method: "post",
            url: "/sign-in",
            url_example: "/sign-in",
            details: {
                validation: true,
                requestBody: {
                    email: VALIDATION.CUSTOMER.email.type,
                    password: VALIDATION.CUSTOMER.password.type
                }
            },
            description: DESCRIPTION.CUSTOMER.SING_IN,
            callbacks: [ function (req, res) {
                const {email, password} = req.body;

                dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password))
                    .then(getFirstCustomer)
                    .then(addToken)
                    .then(response => {
                        console.log(11111111, response)

                        return response;
                    })
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.CUSTOMER.SING_IN, {email, password}))
            }]
        },
        {
            method: "post",
            url: "/sign-up",
            url_example: "/sign-up",
            details: {
                validation: true,
                requestBody: {
                    name: VALIDATION.CUSTOMER.name.type,
                    email: VALIDATION.CUSTOMER.email.type,
                    phone: VALIDATION.CUSTOMER.phone.type,
                    password: VALIDATION.CUSTOMER.password.type,
                }
            },
            description: DESCRIPTION.CUSTOMER.SING_UP,
            callbacks: [ function (req, res) {
                const {name, phone, password, email} = req.body;
                const join_date = new Date().getTime();
                const customer = {name, phone, password, email, join_date};

                VALIDATOR.CUSTOMER.SING_UP(customer)
                    .then(() => dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL(email)))
                    .then(response => {
                            if (response.length) {
                                throw new Error('This email is already used. Please login.')
                            }
                        }
                    )
                    .then(() => dbRequest(QUERY.CUSTOMER.INSERT(customer)))
                    .then(() => dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password)))
                    .then(getFirstCustomer)
                    .then(addToken)
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.CUSTOMER.SING_UP, customer))
            }]
        },
        {
            method: "post",
            url: "/change-password",
            url_example: "/change-password",
            details: {
                requestBody: {
                    email: VALIDATION.CUSTOMER.email.type,
                    password: VALIDATION.CUSTOMER.password.type,
                    newPassword: VALIDATION.CUSTOMER.password.type,
                }
            },
            description: DESCRIPTION.CUSTOMER.CHANGE_PASSWORD,
            callbacks: [ function (req, res) {
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
            }]
        }
    ]
}


module.exports = routes;