const logRequestDetails = (req, res, next) => {
    console.log(
        '----> URL REQUEST: '.bold.blue,
        req.method.bold.blue,
        req.url.bold.blue,
        !!Object.keys(req.body).length ?  `BODY: ${JSON.stringify(req?.body)}`.bold.blue : ''
    );
    next();
}

module.exports = {
    logRequestDetails,
};