const sendHandler = res => data => res.status(200).send(data);

const catchHandler = (res, description = '', data) => ({message}) => {
    console.log('Error !!! ', description, data || ' ', message);
    res.status(400).send(JSON.stringify({message}))
}

const getFirstCustomer = customers => {
    if (customers.length > 0) {
        const {ID, NAME, EMAIL, PHONE, PASSWORD, IS_VERIFIED_EMAIL} = customers[0];
        return {ID, NAME, EMAIL, PHONE, PASSWORD, IS_VERIFIED_EMAIL};
    }

    throw new Error('Wrong credentials.');
}

module.exports = {
    sendHandler,
    catchHandler,
    getFirstCustomer
}