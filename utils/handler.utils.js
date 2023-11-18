const sendHandler = (res, logger) => data => {
    logger.addLog('response 200')
    logger.addLog(data)
    logger.writeLog();
    res.status(200).send(data);
}

const catchHandler = ({res, status, logger}) =>
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