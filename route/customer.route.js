const {dbRequest} = require("../utils/connection.utils");
const QUERY = require("../utils/query.utils");
const {VALIDATOR, VALIDATION} = require("../utils/validation.utils");
const {catchHandler, sendHandler} = require("../utils/handler.utils");
const {getFirstCustomer, convertCustomerFields} = require("../utils/customers.utils");
const {DESCRIPTION, PERMISSION} = require("../utils/description.utils");
const {Token, verifyToken} = require("../middleware/auth.middleware");
const {throwError} = require("../utils/error.utils");
const {Logger} = require("../middleware/log.middleware");

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
            description: DESCRIPTION.CUSTOMER.SING_IN,
            details: {
                bodyValidation: true,
                requestBody: {
                    email: VALIDATION.CUSTOMER.email.type,
                    password: VALIDATION.CUSTOMER.password.type
                }
            },
            callbacks: [
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.CUSTOMER.SING_IN)

                    const {email, password} = req.body;



                    dbRequest(logger.addQueryDB(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password)))
                        .then(convertCustomerFields)
                        .then(getFirstCustomer(req))
                        .then(addToken)
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
                }]
        },
        {
            method: "post",
            url: "/sign-up",
            url_example: "/sign-up",
            description: DESCRIPTION.CUSTOMER.SING_UP,
            details: {
                bodyValidation: true,
                requestBody: {
                    name: VALIDATION.CUSTOMER.name.type,
                    email: VALIDATION.CUSTOMER.email.type,
                    phone: VALIDATION.CUSTOMER.phone.type,
                    password: VALIDATION.CUSTOMER.password.type,
                    isBusinessOwner: VALIDATION.CUSTOMER.isBusinessOwner.type,
                }
            },
            callbacks: [
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.CUSTOMER.SING_UP)

                    const {name, phone, password, email, isBusinessOwner} = req.body;
                    const join_date = new Date().getTime();
                    const customer = {
                        name,
                        phone,
                        password,
                        email,
                        join_date,
                        can_create_companies: 1,
                        isBusinessOwner
                    };

                    VALIDATOR.CUSTOMER.SING_UP(customer)
                        .then(() => dbRequest(logger.addQueryDB(QUERY.CUSTOMER.SELECT_BY_EMAIL(email))))
                        .then(response => {
                                if (response.length) {
                                    throwError("CUSTOMER.EMAIL_USED", req)
                                }
                            }
                        )
                        .then(() => dbRequest(logger.addQueryDB(QUERY.CUSTOMER.INSERT(customer))))
                        .then(() => dbRequest(logger.addQueryDB(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password))))
                        .then(convertCustomerFields)
                        .then(getFirstCustomer(req))
                        .then(addToken)
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
                }]
        },
        {
            method: "post",
            url: "/edit-business-type",
            url_example: "/edit-business-type",
            description: DESCRIPTION.CUSTOMER.EDIT_BUSINESS_TYPE,
            details: {
                bodyValidation: true,
                ...PERMISSION(['4. Check ownership.']),
                requestBody: {
                    isBusinessOwner: VALIDATION.CUSTOMER.isBusinessOwner.type,
                }
            },
            callbacks: [
                verifyToken,
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.CUSTOMER.EDIT_BUSINESS_TYPE)

                    const {isBusinessOwner} = req.body;
                    const customerId = req.customer.id;

                    dbRequest(logger.addQueryDB(QUERY.CUSTOMER.CHANGE_IS_BUSINESS_OWNER(customerId, isBusinessOwner)))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
                }]
        },
        {
            method: "post",
            url: "/change-password",
            url_example: "/change-password",
            description: DESCRIPTION.CUSTOMER.CHANGE_PASSWORD,
            details: {
                requestBody: {
                    email: VALIDATION.CUSTOMER.email.type,
                    password: VALIDATION.CUSTOMER.password.type,
                    newPassword: VALIDATION.CUSTOMER.password.type,
                },
                ...PERMISSION(['4. Check ownership.']),
            },
            callbacks: [
                verifyToken,
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.CUSTOMER.CHANGE_PASSWORD)

                    const {password, email, newPassword} = req.body;
                    const customer = {password, email, newPassword};

                    VALIDATOR.CUSTOMER.CHANGE_PASSWORD(customer)
                        .then(() => dbRequest(logger.addQueryDB(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, password))))
                        .then(response => {
                                if (!response.length) {
                                    throwError("CUSTOMER.WRONG_OLD_PASSWORD", req)
                                }
                            }
                        )
                        .then(() => dbRequest(logger.addQueryDB(QUERY.CUSTOMER.UPDATE_PASSWORD(customer))))
                        .then(() => dbRequest(logger.addQueryDB(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_PASSWORD(email, newPassword))))
                        .then(convertCustomerFields)
                        .then(getFirstCustomer(req))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
                }]
        },
        {
            "method": "put",
            "url": "/verify-email",
            "description": DESCRIPTION.CUSTOMER.VERIFY_EMAIL,
            callbacks: [
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.CUSTOMER.VERIFY_EMAIL)

                    const {email, emailVerificationCode} = req.body;

                    VALIDATOR.CUSTOMER.VALIDATE_EMAIL({email, emailVerificationCode})
                        .then(() => dbRequest(logger.addQueryDB(QUERY.CUSTOMER.SELECT_BY_EMAIL_AND_EMAIL_VERIFICATION_CODE(email, emailVerificationCode))))
                        .then(response => {
                                if (!response.length) {
                                    throwError("CUSTOMER.WRONG_EMAIL_VERIFICATION_CODE", req)
                                }
                            }
                        )
                        .then(() => dbRequest(logger.addQueryDB(QUERY.CUSTOMER.SET_IS_VERIFFIED_EMAIL_TRUE(email))))
                        .then(() => ({isEmailVerified: true}))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger}));
                }]
        }
    ]
}


module.exports = routes;