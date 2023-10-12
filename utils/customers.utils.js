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
    console.log(6000, 'convertCustomerFields: ', res);
    return res.map(customer => {
        const {
            ID: id,
            NAME: name,
            PHONE: phone,
            EMAIL: email,
            PASSWORD: password,
            IS_VERIFIED_EMAIL: isVerifiedEmail,
            CAN_CREATE_COMPANIES: canCreateCompanies,
        } = customer;

        return {
            id,
            name,
            phone,
            email,
            password,
            isVerifiedEmail,
            canCreateCompanies
        }
    })
}

module.exports = {
    getFirstCustomer,
    convertCustomerFields
}