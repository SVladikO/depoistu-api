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
export class Loggger {
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

    addLog(event) {
        this.log.push(event)
        return event;
    }

    writeLog() {
        let result = '';
        this.log.push('----> end of request <----')
        this.log.forEach(log => result + log + '\n')
        console.log(result);
    }
}
