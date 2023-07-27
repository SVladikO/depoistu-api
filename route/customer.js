const {dbRequest} = require("../utils");
const QUERY = require("../db/query");
const VALIDATOR = require("../utils/validation");
const {catchHandler, sendHandler} = require("../utils/responce");
const DESCRIPTION = require("../utils/description");
// const nodemailer = require('nodemailer');

const getFirstCustomer = customers => {
    if (customers.length > 0) {
        const {ID, NAME, EMAIL, PHONE, PASSWORD, IS_VERIFIED_EMAIL} = customers[0];
        return {ID, NAME, EMAIL, PHONE, PASSWORD, IS_VERIFIED_EMAIL};
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
                    // .then(() => {
                    //
                    //     var transporter = nodemailer.createTransport({
                    //         service: 'gmail',
                    //         auth: {
                    //             user: 'vlad.serhiychuk@gmail.com',
                    //             pass: '/XNMiwr111'
                    //         }
                    //     });
                    //
                    //     var mailOptions = {
                    //         from: 'vlad.serhiychuk@gmail.com',
                    //         to: 'serhiichuk.irina@gmail.com',
                    //         subject: 'Verification code for your email',
                    //         text: '1686300364887'
                    //     };
                    //
                    //     transporter.sendMail(mailOptions, function(error, info){
                    //         if (error) {
                    //             throw new Error(error);
                    //         } else {
                    //             console.log('Email sent: ' + info.response);
                    //         }
                    //     });
                    // })
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
        },
        {
            "method": "put",
            "url": "/verify-email",
            "description": DESCRIPTION.CUSTOMER.VERIFY_EMAIL,
            callback: function (req, res) {
                const {email, emailVerificationCode} = req.body;
                console.log(1111, {email, emailVerificationCode})

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
            }
        }
    ]
}


module.exports = routes;