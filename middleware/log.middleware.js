const logRequestDetails = (req, res, next) => {

    next();
}



/**
 * Generate standard of start request log.
 *
 * @param req
 * @return {string[]}
 */
class Logger {
    constructor(req = {method: 'default', url: 'default', body: {}}) {
        this.log = [
            '',
            '----> start of request <----',
            req.method + ' ' + req.url
        ]


        if (!!Object.keys(req.body).length) {
            this.log.push(`BODY: ${JSON.stringify(req?.body)}`)
        }
    }

    addQueryDB(query) {
        this.log.push(query.split(/\s/g).filter(Boolean).join(' '))
        return query;
    }

    addLog(event) {
        this.log.push(event)
        return event;
    }

    writeLog() {
        let result = '';
        this.log.push('')

        this.log.forEach(log => result += log + ' \n ')
        console.log(result);
    }
}

module.exports = {
    logRequestDetails,
    Logger
};