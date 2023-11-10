const {dbRequest} = require("../utils/connection");

const QUERY = require("../utils/query");
const {DESCRIPTION} = require("../utils/description");
const {verifyToken} = require("../middleware/auth");
const {convertCompanyFields} = require("../utils/company.utils")
const {sendHandler, catchHandler} = require("../utils/handler")

const routes = {
    "name": "Favorite company",
    description: "For favorite company data.",
    "routes": [
        {
            method: "get",
            url: "/favorite-companies",
            url_example: "/favorite-companies",
            description: DESCRIPTION.FAVORITE_COMPANY.GET_BY_CUSTOMER_ID,
            callbacks: [
                verifyToken,
                function (req, res) {

                const {id: customer_id } = req.customer;

                dbRequest(QUERY.FAVORITE_COMPANY.SELECT_BY_CUSTOMER_ID(customer_id))
                    .then(convertCompanyFields)
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.FAVORITE_COMPANY.GET_BY_CUSTOMER_ID, customer_id))
            }]
        },
        {
            method: "post",
            url: "/favorite-companies",
            url_example: "/favorite-companies",
            description: DESCRIPTION.FAVORITE_COMPANY.ADD,
            callbacks: [
                verifyToken,
                function (req, res) {

                const {id: customer_id } = req.customer;
                const {company_id } = req.body;

                dbRequest(QUERY.FAVORITE_COMPANY.ADD(customer_id, company_id))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.FAVORITE_COMPANY.GET_BY_CUSTOMER_ID, customer_id))
            }]
        },
        {
            method: "delete",
            url: "/favorite-companies",
            url_example: "/favorite-companies",
            description: DESCRIPTION.FAVORITE_COMPANY.DELETE,
            callbacks: [
                verifyToken,
                function (req, res) {

                const {id: customer_id } = req.customer;
                const {company_id } = req.body;

                dbRequest(QUERY.FAVORITE_COMPANY.DELETE(customer_id, company_id))
                    .then(sendHandler(res))
                    .catch(catchHandler(res, DESCRIPTION.FAVORITE_COMPANY.GET_BY_CUSTOMER_ID, customer_id))
            }]
        },
    ]
};

module.exports = routes;