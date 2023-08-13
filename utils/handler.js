const sendHandler = res => data => res.status(200).send(data);

const catchHandler = (res, description = '', data) => obj => {
    const {errorMessage, message} = obj;
    console.log('----! ERROR '.bold.red, description, data || ' ', errorMessage || message);
    res.status(400).send(JSON.stringify({errorMessage: errorMessage || message}))
}

module.exports = {
    sendHandler,
    catchHandler,
}