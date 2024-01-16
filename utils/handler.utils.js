const {Logger} = require("../middleware/log.middleware");
const IS_SHOW_SUCCESS_LOGS = !!+process.env.IS_SHOW_SUCCESS_LOGS;
const IS_SHOW_ERROR_LOGS = !!+process.env.IS_SHOW_ERROR_LOGS;

const sendHandler = (res, logger = new Logger(), status = 200) => data => {
    logger.addLog('data: ' + data);
    logger.addLog('end of request SUCCESS');
    IS_SHOW_SUCCESS_LOGS && logger.writeLog();
    res.status(status).send(data);
}

const catchHandler = ({res, status = 500, logger = new Logger()}) =>
    e => {
        logger.changeMarker()
        const message = e.message;
        // We take status from handled errors.
        // But if we don't handle some cases we will get undefinde which broke BE.
        // We don't need it
        const _status = e.status === undefined ? (status || 500) : e.status;

        logger.addLog('ERROR STATUS: ' + _status);
        logger.addLog('ERROR MESSAGE: ' + message);
        logger.addLog('end of request');
        IS_SHOW_ERROR_LOGS && logger.writeLog();

        res.status(_status).send(JSON.stringify({message}));
    }

module.exports = {
    sendHandler,
    catchHandler,
}