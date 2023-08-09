const jwt = require('jsonwebtoken');
const {catchHandler, getFirstCustomer} = require('../utils/responce')
const {dbRequest} = require("../utils");
const QUERY = require("../db/query");

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
        return catchHandler(res)({message: "A token is required for authentication"})
    }

    let customer;

    try {
        customer = Token.verify(token);
    } catch (err) {
        return catchHandler(res)({message: "Invalid Token"});
    }

    dbRequest(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(customer.email, customer.password))
        .then(getFirstCustomer)
        .then(res => {
            req.customer = res;
            next();
        })
        .catch(catchHandler(res, 'Customer does not exist. Verification is failed.', {}))
}

module.exports = {
    verifyToken,
    Token,
    TOKEN_NAME: X_ACCESS_TOKEN_NAME
};
