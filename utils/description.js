const {TOKEN_NAME} = require("../middleware/auth");

const DESCRIPTION = {
    CUSTOMER: {
        SING_IN: "Customer Sing IN.",
        SING_UP: "Customer Sing UP.",
        CHANGE_PASSWORD: "Customer change password.",
    },
    COMPANY: {
        GET_BY_CITY: "Get companies by city uniq identifier.",
        GET_BY_CITY_ID: "Get companies by city id.",
        GET_BY_COMPANY_ID: "Get company by companyId.",
        GET_BY_CUSTOMER_ID: "Get companies by customer id.",
        GET_AVAILABLE_CITIES: "Get array cities. Avoid duplication.",
        CREATE: "Create company.",
        UPDATE: "Update company.",
        DELETE: "Delete company by companyId.",
    },
    MENU_ITEM: {
        GET_BY_COMPANY_ID: "Get menu by companyId",
        CREATE: "Create menu item.",
        UPDATE: "Update menu item.",
        DELETE: "Delete menu item.",
    },
}

const PERMISSION = {"permission": `BE check in headers[${TOKEN_NAME}]`};

module.exports = {
    DESCRIPTION,
    PERMISSION,
};