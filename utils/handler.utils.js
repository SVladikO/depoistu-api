const {Logger} = require("../middleware/log.middleware");
const IS_SHOW_SUCCESS_LOGS = !!+process.env.IS_SHOW_SUCCESS_LOGS;
const IS_SHOW_ERROR_LOGS = !!+process.env.IS_SHOW_ERROR_LOGS;

const sendHandler = (res, logger = new Logger(), status = 200) => data => {
    logger.addLog('data: ' + data);
    logger.addLog('end of request SUCCESS');
    IS_SHOW_SUCCESS_LOGS && logger.writeLog();
    res.status(status).send(data);
}

const catchHandler = ({res, status, logger = new Logger()}) =>
    e => {
        logger.changeMarker()
        const errorMessage = e.message;
        const _status = e.code || status;
        logger.addLog('ERROR STATUS:');
        logger.addLog(_status);
        logger.addLog('ERROR MESSAGE:');
        logger.addLog(errorMessage);
        logger.addLog('end of request');
        IS_SHOW_ERROR_LOGS && logger.writeLog();

        res.status(_status).send(JSON.stringify({errorMessage}));
    }

module.exports = {
    sendHandler,
    catchHandler,
}