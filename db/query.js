const QUERY = {
    MENU_ITEM: {
        SELECT_ALL_BY_COMPANY_ID:  companyId => `select * from root.menu_item where company_id = ${companyId};`,
        SELECT_CATEGORY_ID_BY_COMPANY_ID:  companyId => `select category_id from root.menu_item where company_id = ${companyId};`,
        SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID: (companyId, categoryId) => `select * from root.menu_item where category_id = ${categoryId} and company_id = ${companyId};`,
        SELECT_GUEST:  (email, password) => `select * from root.guest where email = '${email}' and password = '${password}';`,
        INSERT: ``,

        INSERT_HISTORY:
            (guest_id, company_id, order_details, date_time) =>
                `INSERT INTO root.history (id, GUEST_ID, COMPANY_ID, ORDER_DETAILS, DATE_TIME, is_paid, is_prepared)
                 VALUES (DEFAULT, ${guest_id}, ${company_id}, '${order_details}', ${date_time}, true, true);`
    }
}

module.exports = QUERY;