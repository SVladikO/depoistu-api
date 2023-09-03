const {resolve, TRANSLATION} = require("./translations");

function getFirstCustomer(req) {
    return customers => {
        if (customers.length > 0) {
            return customers[0];
        }

        throw new Error(resolve(TRANSLATION.CUSTOMER.WRONG_CREDENTIALS, req));
    }
}

function convertCustomerFields(res) {
    return res.map(customer => {
        const {
            ID: id,
            NAME: name,
            PHONE: phone,
            EMAIL: email,
            PASSWORD: password,
            IS_VERIFIED_EMAIL: isVerifiedEmail,
        } = customer;

        return {
            id,
            name,
            phone,
            email,
            password,
            isVerifiedEmail
        }
    })
}

module.exports = {
    getFirstCustomer,
    convertCustomerFields
}