const {throwError} = require("./error.utils");

function getFirstCustomer(req) {
    return customers => {
        if (customers.length > 0) {
            return customers[0];
        }

        throwError("CUSTOMER.WRONG_CREDENTIALS", req);
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
            IS_BUSINESS_OWNER: isBusinessOwner,
            CAN_CREATE_COMPANIES: canCreateCompanies,
        } = customer;

        return {
            id,
            name,
            phone,
            email,
            password,
            isVerifiedEmail,
            isBusinessOwner,
            canCreateCompanies
        }
    })
}

module.exports = {
    getFirstCustomer,
    convertCustomerFields
}