/**
 * Generate standard of start request log.
 *
 * @param req
 * @return {string[]}
 */
class Logger {
    constructor(req = {method: 'default', url: 'default', body: {}}) {
        this.marker = ' ----- '

        const d = new Date();
        const requestDate = `${d.getDate()}.${d.getMonth()}.${d.getFullYear()}`;
        const requestTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

        this.log = [
            '',
            'NEW REQUEST',
            requestDate + ' ' + requestTime,
            req.method + ' ' + req.url,
        ]


        if (!!Object.keys(req.body).length) {
            this.log.push(`BODY: ${JSON.stringify(req?.body)}`)
        }
    }

    /**
     * Add db query
     *
     * @param query
     * @return {*}
     */
    addQueryDB(query) {
        this.log.push(query.split(/\s/g).filter(Boolean).join(' '))
        return query;
    }

    /**
     * Add request steps
     *
     * @param event
     * @return {*}
     */
    addLog(event) {
        this.log.push(event)
        return event;
    }

    /**
     * Let's simplify error detection in console
     */
    changeMarker() {
        this.marker = ' ????? '
    }

    /**
     * Write to console
     */
    writeLog() {
        let result = '';
        this.log.forEach(log => result += this.marker + log + ' \n ')
        console.log(' \n ' + ' \n ' + result);
    }
}

module.exports = {
    Logger
};