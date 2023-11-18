const {Logger} = require("../middleware/log.middleware");

const sendHandler = (res, logger = new Logger()) => data => {
    logger.addLog('data: ' + data)
    logger.addLog('end of request SUCCESS')
    logger.writeLog();
    res.status(200).send(data);
}

const catchHandler = ({res, status, logger = new Logger()}) =>
    e => {
        logger.changeMarker()
        const errorMessage = e.errorMessage || e.message;
        logger.addLog('ERROR')
        logger.addLog('ERROR MESSAGE:')
        logger.addLog(errorMessage)
        logger.addLog('end of request ERROR')
        logger.writeLog();
        res.status(status).send(JSON.stringify({errorMessage}))
    }

module.exports = {
    sendHandler,
    catchHandler,
}