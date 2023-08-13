const logRequestDetails = (req, res, next) => {
    console.log(
        '----> NEW REQUEST: '.bold.blue,
        req.method.bold.blue,
        req.url.bold.blue,
        req.body ?  `Body: ${JSON.stringify(req?.body)}`.bold.blue : ''
    );
    next();
}

module.exports = {
    logRequestDetails,
};