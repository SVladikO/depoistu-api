const responseSuccess = (res, successMessage) => {
    res.status(200).send({successMessage})
}

const responseError = (res, status, errorMessage) => {
    const message = JSON.stringify({errorMessage});
    res.status(status).send(message)
}

module.exports = {
    responseError,
    responseSuccess,
}