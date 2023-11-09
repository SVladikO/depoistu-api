const logRequestDetails = (req, res, next) => {
    console.log(
        '---->',
        req.method,
        req.url,
        !!Object.keys(req.body).length ?  `BODY: ${JSON.stringify(req?.body)}` : ''
    );
    next();
}

module.exports = {
    logRequestDetails,
};