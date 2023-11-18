const logRequestDetails = (req, res, next) => {

    next();
}

module.exports = {
    logRequestDetails,
};

/**
 * Generate standard of start request log.
 *
 * @param req
 * @return {string[]}
 */
class Log {
    constructor(req) {
        this.log = [
            '',
            '----> start of request <----',
            req.method + ' ' + req.url
        ]


        if (!!Object.keys(req.body).length) {
            this.log.push(`BODY: ${JSON.stringify(req?.body)}`)
        }
    }

    addLog() {

    }

    writeLog() {

    }
}
