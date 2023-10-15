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
        // {
        //     method: "post",
        //     url: "/favorite-companies",
        //     url_example: "/companies",
        //     details: {
        //         ...PERMISSION(['4. Check permission to create more companies.']),
        //         bodyValidation: true,
        //         requestBody: {
        //             name: VALIDATION.COMPANY.name.type,
        //             cityId: VALIDATION.COMPANY.cityId.type,
        //             street: VALIDATION.COMPANY.street.type,
        //             phone1: VALIDATION.COMPANY.phone1.type,
        //             phone2: VALIDATION.COMPANY.phone2.type,
        //             phone3: VALIDATION.COMPANY.phone3.type,
        //             schedule: VALIDATION.COMPANY.schedule.type,
        //         },
        //     },
        //     description: DESCRIPTION.COMPANY.CREATE,
        //     callbacks: [
        //         verifyToken,
        //         checkAvailableCompany,
        //         function (req, res) {
        //             const customerId = req.customer.id;
        //             const {name, cityId, street, phone1, phone2, phone3, schedule} = req.body;
        //             const joinDate = '' + new Date().getTime();
        //             const company = {customerId, name, phone1, phone2, phone3, cityId, street, joinDate, schedule};
        //
        //             VALIDATOR.COMPANY.CREATE(company)
        //                 .then(() => dbRequest(QUERY.COMPANY.INSERT(company)))
        //                 .then(sendHandler(res))
        //                 .catch(catchHandler(res, DESCRIPTION.COMPANY.CREATE, company));
        //         }]
        // },
    ]
};

module.exports = routes;