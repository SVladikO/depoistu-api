const {dbRequest} = require("../utils/connection.utils");

const {verifyToken} = require("../middleware/auth.middleware");

const QUERY = require("../utils/query.utils");
const {VALIDATION} = require("../utils/validation.utils")
const {DESCRIPTION, PERMISSION} = require("../utils/description.utils");

const {sendHandler, catchHandler} = require("../utils/handler.utils")
const {Logger} = require("../middleware/log.middleware");

const routes = {
    name: "Order history",
    description: "For order history data manipulation.",
    routes: [
        {
            method: "get",
            url: "/order-histories/:customerId",
            url_example: "/order-histories/:customerId",
            description: DESCRIPTION.ORDER_HISTORY.GET_ALL,
            callbacks: [
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.ORDER_HISTORY.GET_ALL)

                    const customerId = +req.params.customerId;
                    console.log(2222, {customerId})

                    // company_name, city_id, total, date,
                    dbRequest(logger.addQueryDB(QUERY.ORDER_HISTORY.SELECT_ALL_BY_CUSTOMER_ID(customerId)))
                        .then(convertOrderHistoryFields)
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger, status: 400}));
                }
            ]
        },
        {
            method: "get",
            url: "/order-history-details/:orderHistoryId",
            url_example: "/order-history",
            description: DESCRIPTION.ORDER_HISTORY.GET_ORDER_HISTORY_DETAILS_BY_ORDER_HISTORY_ID,
            callbacks: [
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.ORDER_HISTORY.GET_ORDER_HISTORY_DETAILS_BY_ORDER_HISTORY_ID)

                    const orderHistoryId = +req.params.orderHistoryId;

                    dbRequest(logger.addQueryDB(QUERY.ORDER_HISTORY_DETAILS.SELECT_ALL_BY_ORDER_HISTORY_ID(orderHistoryId)))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger, status: 400}));
                }
            ]
        },
        {
            method: "post",
            url: "/order-histories",
            url_example: "/order-history",
            description: DESCRIPTION.ORDER_HISTORY.CREATE,
            details: {
                ...PERMISSION(['4. Check token to let place order.']),
                bodyValidation: true,
                requestBody: {
                    // company_id: VALIDATION.COMPANY.company_id.type,
                    // order_items: [
                    //     {
                    //         id: VALIDATION.COMPANY.id.type,
                    //         amount1: VALIDATION.COMPANY.amount.type,
                    //         amount2: VALIDATION.COMPANY.amount.type,
                    //         amount3: VALIDATION.COMPANY.amount.type,
                    //         price1: VALIDATION.COMPANY.price.type,
                    //         price2: VALIDATION.COMPANY.price.type,
                    //         price3: VALIDATION.COMPANY.price.type,
                    //     }
                    // ]
                },
            },
            callbacks: [
                verifyToken,
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.ORDER_HISTORY.CREATE)

                    const customerId = req.customer.id;
                    const {company_id, order_items} = req.body;
                    const orderHistory = {
                        customer_id: customerId,
                        company_id,
                        total: order_items.reduce(
                            (accumulator, {amount1 = 0, amount2 = 0, amount3 = 0, price1 = 0, price2 = 0, price3 = 0}) =>
                                accumulator +
                                (+amount1 * +price1) +
                                (+amount2 * +price2) +
                                (+amount3 * +price3),
                            0
                        ),
                        date: '' + new Date().getTime(),
                    }

                    // console.log(7777,
                    //     QUERY.ORDER_HISTORY_DETAILS.INSERT(order_items, 1000)
                    // )

                    dbRequest(logger.addQueryDB(QUERY.ORDER_HISTORY.INSERT(orderHistory)))
                        .then(res => dbRequest(logger.addQueryDB(QUERY.ORDER_HISTORY_DETAILS.INSERT(order_items, res.insertId))))
                        .then(sendHandler(res, logger))
                        .catch(catchHandler({res, logger, status: 400}));
                }]
        },
    ]
};


function convertOrderHistoryFields(orderHistories) {
    return orderHistories.map(orderHistory => {
        const {
            ID: id,
            NAME: company_name,
            CITY_ID: city_id,
            TOTAL: total,
            DATE: date,
        } = orderHistory;

        return {
            id,
            company_name,
            city_id: +city_id,
            total,
            date: +date
        }
    })
}

module.exports = routes;