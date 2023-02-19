const QUERY = {
    MENU_ITEM: {
        SELECT_ALL_BY_COMPANY_ID: companyId => `select *
                                                from root.menu_item
                                                where company_id = ${companyId};`,
        SELECT_CATEGORY_ID_BY_COMPANY_ID: companyId => `select category_id
                                                        from root.menu_item
                                                        where company_id = ${companyId};`,
        SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID: (companyId, categoryId) => `select *
                                                                                 from root.menu_item
                                                                                 where category_id = ${categoryId}
                                                                                   and company_id = ${companyId};`,
    },
    HISTORY: {
        INSERT:
            (customer_id, company_id, order_details, date_time) =>
                `INSERT INTO root.history (id, CUSTOMER_ID, COMPANY_ID, ORDER_DETAILS, DATE_TIME, is_paid, is_prepared)
                 VALUES (DEFAULT, ${customer_id}, ${company_id}, '${order_details}', ${date_time}, true, true);`
    },
    COMPANY: {
        SELECT_BY_CITY: city => `SELECT * from root.company WHERE city = '${city}'`,
    },
    CUSTOMER: {
        SELECT_BY_EMAIL_AND_PASSWORD: (email, password) => `select * from root.customer where email = '${email}' and password = '${password}';`,
    },
    // INSERT: ``,
    // CREATE: ``,
    // DELETE: `DROP TABLE IF EXISTS root.COMPANY`,
}

module.exports = QUERY;