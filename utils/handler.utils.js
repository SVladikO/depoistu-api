const sendHandler = res => data => {
    console.log('response 200')
    console.log(data)
    console.log('----> end of request <----')
    console.log('')
    res.status(200).send(data);
}

const catchHandler = (res, description = '', dbRequestData) => obj => {
    const {errorMessage, message} = obj;
    console.log('_______________________________')
    console.log('_______________________________')
    console.log('_______________________________')
    console.log('****! ERROR IN -> ', description, dbRequestData || ' ', (errorMessage || message));
    console.log('_______________________________')
    console.log('_______________________________')
    console.log('_______________________________')
    res.status(400).send(JSON.stringify({errorMessage: errorMessage || message}))
}

module.exports = {
    sendHandler,
    catchHandler,
}