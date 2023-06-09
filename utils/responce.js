const responseSuccess = (res, successMessage) => {
    res.status(200).send({successMessage})
}

const responseError = () => {
}
const catchHandler = (res, description, data) => ({message}) => {
    console.log('Error !!! ', description, data || ' ', message);
    res.status(400).send(JSON.stringify({message}))
}

module.exports = {
    responseError,
    responseSuccess,
    catchHandler
}