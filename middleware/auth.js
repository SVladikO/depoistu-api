const jwt = require('jsonwebtoken');
const {catchHandler} = require('../utils/responce')

const TOKEN_NAME = "x-access-token";

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret-key'

class Token {
}
// Example: https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/
Token.encode = (email, password) => jwt.sign({email, password}, TOKEN_KEY);
Token.decode = token => jwt.verify(token, TOKEN_KEY);

const verifyToken = (req, res, next) => {
    const token = req.headers[TOKEN_NAME];

    if (!token) {
        return catchHandler(res)({message: "A token is required for authentication"})
    }

    try {
        req.cusomer = Token.decode(token);
    } catch (err) {
        return catchHandler(res)({message: "Invalid Token"});
    }

    return next();
}

module.exports = {
    verifyToken,
    Token,
    TOKEN_NAME
};
