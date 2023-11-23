const jwt = require('jsonwebtoken');
const {catchHandler} = require('../utils/handler.utils')
const {getFirstCustomer, convertCustomerFields} = require("../utils/customers.utils");
const {dbRequest} = require("../utils/connection.utils");
const QUERY = require("../utils/query.utils");
const {Logger} = require("./log.middleware");
const {resolveError} = require("../utils/translations.utils")

const X_ACCESS_TOKEN_NAME = "x-access-token";
const TOKEN_SECRET_KEY = process.env.TOKEN_KEY || 'secret-key'

class Token {
}

// Example: https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/
Token.encode = (id, email, password) => jwt.sign({id, email, password}, TOKEN_SECRET_KEY);
Token.verify = token => jwt.verify(token, TOKEN_SECRET_KEY);

const verifyToken = (req, res, next) => {
    const logger = new Logger(req);
    logger.addLog('VERIFY TOKEN')

    const token = req.headers[X_ACCESS_TOKEN_NAME];

    if (!token) {
        return catchHandler(
            {res, logger}
        )(resolveError("CUSTOMER.TOKEN.REQUIRED", req))
    }

    let customer;

    try {
        customer = Token.verify(token);
    } catch (err) {
        logger.addLog('customerId: ' + customer?.id)
        logger.addLog('customerEmail: ' + customer?.email)
        logger.addLog('customerPassword: ' + customer?.password)
        return catchHandler(
            {res, logger}
        )(resolveError("CUSTOMER.TOKEN.INVALID", req))
    }

    dbRequest(
        logger.addQueryDB(
            QUERY.CUSTOMER.SELECT_BY_ID_AND_EMAIL_AND_PASSWORD(customer.id, customer.email, customer.password)
        )
    )
        .then(convertCustomerFields)
        .then(getFirstCustomer(req))
        .then(res => {
            req.customer = res;
            next();
        })
        .catch(catchHandler({res, logger}))
}

module.exports = {
    verifyToken,
    Token,
    TOKEN_NAME: X_ACCESS_TOKEN_NAME
};
