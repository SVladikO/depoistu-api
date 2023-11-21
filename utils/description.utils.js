const {TOKEN_NAME} = require("../middleware/auth.middleware");

const DescriptionUtils = {
    CUSTOMER: {
        SING_IN: "Customer Sing IN.",
        SING_UP: "Customer Sing UP.",
        EDIT_BUSINESS_TYPE: "Customer change isBusinessOwner type.",
        CHANGE_PASSWORD: "Customer change password.",
        VERIFY_EMAIL: "Verify customer email.",
    },
    FAVORITE_COMPANY: {
        GET_BY_CUSTOMER_ID: "Get favorite company by customer id. We take customer id from access token.",
        ADD: "Add to favorite company.",
        DELETE: 'Delete company from favorite.',
    },

    COMPANY: {
        GET_BY_CITY: "Get companies by city uniq identifier.",
        GET_BY_CITY_ID: "Get companies by city id which have visible menu.",
        GET_BY_COMPANY_ID: "Get company by companyId.",
        GET_BY_CUSTOMER_ID: "Get companies by customer id.",
        GET_AVAILABLE_CITIES: "Get array of city ids which have company with available menu. Without duplication ids.",
        CREATE: "Create company. We take customer id from token.",
        UPDATE: "Update company.",
        DELETE: "Delete company by companyId.",
    },
    MENU_ITEM: {
        GET_BY_COMPANY_ID: "Get menu by companyId",
        GET_ONLY_VISIBLE_BY_COMPANY_ID: "Get only visible menu by companyId",
        CREATE: "Create menu item.",
        UPDATE_IS_VISIBLE: "Update menu item visibility.",
        UPDATE: "Update menu item.",
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