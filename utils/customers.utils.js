function getFirstCustomer(customers) {
    if (customers.length > 0) {
        const {ID, NAME, EMAIL, PHONE, PASSWORD, IS_VERIFIED_EMAIL} = customers[0];
        return {ID, NAME, EMAIL, PHONE, PASSWORD, IS_VERIFIED_EMAIL};
    }

    throw new Error("Wrong credentials. Customer doesn't exist");
}

module.exports = {
    getFirstCustomer,
}