const {Logger} = require("../middleware/log.middleware");

const sendHandler = (res, logger = new Logger()) => data => {
    logger.addLog('SUCCESS 200')
    logger.addLog('data: ' + data)
    logger.writeLog();
    res.status(200).send(data);
}

const catchHandler = ({res, status, logger = new Logger()}) =>
    e => {
        const errorMessage = e.errorMessage || e.message;
        logger.addLog('ERROR')
        logger.addLog(errorMessage)
        logger.addLog('---------------')
        logger.writeLog();
        res.status(status).send(JSON.stringify({errorMessage}))
    }

module.exports = {
    sendHandler,
    catchHandler,
}