const jwt = require('jsonwebtoken');
const {catchHandler} = require('../utils/handler')
const {getFirstCustomer} = require("../utils/customers.utils");
const {dbRequest} = require("../utils/connection");
const QUERY = require("../utils/query");

const X_ACCESS_TOKEN_NAME = "x-access-token";
const TOKEN_SECRET_KEY = process.env.TOKEN_KEY || 'secret-key'

class Token {
}

// Example: https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/
Token.encode = (id, email, password) => jwt.sign({id, email, password}, TOKEN_SECRET_KEY);
Token.verify = token => jwt.verify(token, TOKEN_SECRET_KEY);

const verifyToken = (req, res, next) => {
    const token = req.headers[X_ACCESS_TOKEN_NAME];

    if (!token) {
        return catchHandler(res)({errorMessage: "A token is required for authentication"})
    }

    let customer;

    try {
        customer = Token.verify(token);
    } catch (err) {
        return catchHandler(res)({errorMessage: "Invalid Token"});
    }

    dbRequest(QUERY.CUSTOMER.SELECT_BY_ID_AND_EMAIL_AND_PASSWORD(customer.id, customer.email, customer.password))
        .then(getFirstCustomer)
        .then(res => {
            req.customer = res;
            next();
        })
        .catch(catchHandler(res, 'Customer does not exist. Verification is failed.'))
}

module.exports = {
    verifyToken,
    Token,
    TOKEN_NAME: X_ACCESS_TOKEN_NAME
};
