const {dbRequest} = require("../utils/connection");
const QUERY = require("../utils/query");
const {VALIDATOR, VALIDATION} = require("../utils/validation");
const {catchHandler, sendHandler} = require("../utils/handler");
const {getFirstCustomer, convertCustomerFields} = require("../utils/customers.utils");
const {DESCRIPTION} = require("../utils/description");
const {Token} = require("../middleware/auth");
// const nodemailer = require('nodemailer');

const addToken = customer => {
    const {id, email, password} = customer;
    const token = Token.encode(id, email, password);

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
                bodyValidation: true,
                requestBody: {
                    email: VALIDATION.CUSTOMER.email.type,
                    password: VALIDATION.CUSTOMER.password.type
                }
            },
            description: DESCRIPTION.CUSTOMER.SING_IN,
            callbacks: [ function (req, res) {
                const {email, password} = req.body;

                dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password))
                    .then(convertCustomerFields)
                    .then(getFirstCustomer)
                    .then(addToken)
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.CUSTOMER.SING_IN, {email, password}))
            }]
        },
        {
            method: "post",
            url: "/sign-up",
            url_example: "/sign-up",
            details: {
                bodyValidation: true,
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
                    .then(convertCustomerFields)
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
                    .then(convertCustomerFields)
                    .then(getFirstCustomer)
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.CUSTOMER.CHANGE_PASSWORD, customer))
            }]
        },
        {
            "method": "put",
            "url": "/verify-email",
            "description": DESCRIPTION.CUSTOMER.VERIFY_EMAIL,
            callbacks: [function (req, res) {
                const {email, emailVerificationCode} = req.body;

                VALIDATOR.CUSTOMER.VALIDATE_EMAIL({email, emailVerificationCode})
                    .then(() => dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_EMAIL_VERIFICATION_CODE(email, emailVerificationCode)))
                    .then(response => {
                            if (!response.length) {
                                throw new Error('Wrong email verification code.')
                            }
                        }
                    )
                    .then(() => dbRequest(QUERY.CUSTOMER.SET_IS_VERIFFIED_EMAIL_TRUE(email)))
                    .then(() => ({isEmailVerified: true}))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.CUSTOMER.CHANGE_PASSWORD, {email, emailVerificationCode}))
            }]
        }
    ]
}







module.exports = routes;