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
                        .then(convertOrderItems)
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
                    order_items: [
                        // {
                        //     categoryId: VALIDATION.MENU_ITEM.categoryId.type,
                        //     name: VALIDATION.MENU_ITEM.name.type,
                        //     description: VALIDATION.MENU_ITEM.description.type,
                        //     size_1: VALIDATION.MENU_ITEM.size_1.type,
                        //     size_2: VALIDATION.MENU_ITEM.size_2.type,
                        //     size_3: VALIDATION.MENU_ITEM.size_3.type,
                        //     price_1: VALIDATION.MENU_ITEM.price_1.type,
                        //     price_2: VALIDATION.MENU_ITEM.price_2.type,
                        //     price_3: VALIDATION.MENU_ITEM.price_3.type,
                        //     amount_1: VALIDATION.MENU_ITEM.amount.type,
                        //     amount_2: VALIDATION.MENU_ITEM.amount.type,
                        //     amount_3: VALIDATION.MENU_ITEM.amount.type,
                        //     imageUrl: VALIDATION.MENU_ITEM.imageUrl.type,
                        // }
                    ]
                },
            },
            callbacks: [
                verifyToken,
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.ORDER_HISTORY.CREATE)

                    const customerId = req.customer.id;
                    const {order_items} = req.body;
                    const company_id = order_items[0].company_id;
                    const orderHistory = {
                        customer_id: customerId,
                        company_id,
                        total: order_items.reduce(
                            (accumulator, {
                                amount_1 = 0,
                                amount_2 = 0,
                                amount_3 = 0,
                                price_1 = 0,
                                price_2 = 0,
                                price_3 = 0
                            }) =>
                                accumulator +
                                (+amount_1 * +price_1) +
                                (+amount_2 * +price_2) +
                                (+amount_3 * +price_3),
                            0
                        ),
                        date: '' + new Date().getTime(),
                    }

                    dbRequest(logger.addQueryDB(QUERY.ORDER_HISTORY.INSERT(orderHistory)))
                        .then(res => {
                            const orderHistoryId = res.insertId;
                            return dbRequest(logger.addQueryDB(QUERY.ORDER_HISTORY_DETAILS.INSERT(order_items, orderHistoryId)))
                        })
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

function convertOrderItems(orderItems) {
    return orderItems.map(orderItem => {
        const {
            NAME: name,
            DESCRIPTION: description,
            CATEGORY_ID: category_id,
            PRICE_1: price_1,
            PRICE_2: price_2,
            PRICE_3: price_3,
            SIZE_1: size_1,
            SIZE_2: size_2,
            SIZE_3: size_3,
            AMOUNT_1: amount_1,
            AMOUNT_2: amount_2,
            AMOUNT_3: amount_3,
            IMAGE_URL: image_url
        } = orderItem;

        return {
            name,
            description,
            category_id,
            price_1,
            price_2,
            price_3,
            size_1,
            size_2,
            size_3,
            amount_1,
            amount_2,
            amount_3,
            image_url
        }
    })
}

    module.exports = routes;