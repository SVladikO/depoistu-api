const {TOKEN_NAME} = require("../middleware/auth.middleware");

const DescriptionUtils = {
    CUSTOMER: {
        SING_IN: "Customer Sing in.",
        SING_UP: "Customer Sing up.",
        EDIT_BUSINESS_TYPE: "Change customer isBusinessOwner type.",
        CHANGE_PASSWORD: "Change customer password.",
        VERIFY_EMAIL: "Verify customer email.",
    },
    FAVORITE_COMPANY: {
        GET_BY_CUSTOMER_ID: "Get favorite companies per customer by customer_id.",
        CREATE: "Add company to favorite.",
        DELETE: 'Delete company from favorite.',
    },

    COMPANY: {
        GET_BY_CITY: "Get companies by city_id.",
        GET_BY_CITY_ID: "Get companies by city_id which have visible menu.",
        GET_BY_COMPANY_ID: "Get company by company_id.",
        GET_BY_CUSTOMER_ID: "Get companies by customer_id.",
        GET_AVAILABLE_CITIES: "Get city ids where are company with available menu.",
        GET_ALL_COMPANIES: "Get all companies.",
        CREATE: "Create company. customer_id  took from token.",
        UPDATE: "Update company.",
        DELETE: "Delete company by company_id.",
    },
    MENU_ITEM: {
        GET_BY_COMPANY_ID: "Get menu items by company_id.",
        GET_ONLY_VISIBLE_BY_COMPANY_ID: "Get menu items by company_id. Only visible.",
        CREATE: "Create menu item.",
        UPDATE: "Update menu item.",
        UPDATE_IS_VISIBLE: "Update menu item visibility only.",
        DELETE: "Delete menu item.",
    },
}

const PERMISSION = (extra) => {
    let permission = [
        ` 1. Check existence of "${TOKEN_NAME}" in header.`,
        ' 2. Token validation.',
        ' 3. Check customer existence in DB.'
    ];

    if (extra?.length) {
        permission = [...permission, ...extra]
    }

    return {permission};
};

module.exports = {
    DESCRIPTION: DescriptionUtils,
    PERMISSION,
};