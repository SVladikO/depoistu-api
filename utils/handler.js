const sendHandler = res => data => res.status(200).send(data);

const catchHandler = (res, description = '', dbRequestData) => obj => {
    const {errorMessage, message} = obj;
    console.log('****! ERROR '.bold.red, description.bold.red, dbRequestData || ' ', (errorMessage || message).bold.red.underline);
    res.status(400).send(JSON.stringify({errorMessage: errorMessage || message}))
}

module.exports = {
    sendHandler,
    catchHandler,
}