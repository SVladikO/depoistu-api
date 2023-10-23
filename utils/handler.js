const sendHandler = res => data => res.status(200).send(data);

const catchHandler = (res, description = '', dbRequestData) => obj => {
    const {errorMessage, message} = obj;
    console.log('_______________________________')
    console.log('_______________________________')
    console.log('_______________________________')
    console.log('****! ERROR IN -> '.bold.red, description.bold.red, dbRequestData || ' ', (errorMessage || message).bold.red.underline);
    console.log('_______________________________')
    console.log('_______________________________')
    console.log('_______________________________')
    res.status(400).send(JSON.stringify({errorMessage: errorMessage || message}))
}

module.exports = {
    sendHandler,
    catchHandler,
}