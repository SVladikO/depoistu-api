function getFirstCustomer(customers) {
    if (customers.length > 0) {
        return customers[0];
    }

    throw new Error("Wrong credentials. Customer doesn't exist");
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