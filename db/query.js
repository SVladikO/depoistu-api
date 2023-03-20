const QUERY = {
    MENU_ITEM: {
        SELECT_ALL_BY_COMPANY_ID:
                companyId => `select * from MENU_ITEM where company_id = ${companyId};`,
        SELECT_CATEGORY_ID_BY_COMPANY_ID:
                companyId =>  `select category_id from MENU_ITEM where company_id = ${companyId};`,
        SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID:
            (companyId, categoryId) =>  `select * from MENU_ITEM where category_id = ${categoryId} and company_id = ${companyId};`,
        INSERT:
            (category_id, company_id, name, description, cooking_time, price, size, image_url) => `
              INSERT INTO MENU_ITEM (id, category_id, company_id, name, description, cooking_time, price, size, image_url) VALUES
              (default, '${category_id}', '${company_id}', '${name}', '${description}', '${cooking_time}', '${price}', '${size}', '${image_url}');`
    },
    HISTORY: {
        INSERT:
            (customer_id, company_id, order_details, date_time) =>
                `INSERT INTO HISTORY (id, CUSTOMER_ID, COMPANY_ID, ORDER_DETAILS, DATE_TIME, is_paid, is_prepared) VALUES
                 (DEFAULT, ${customer_id}, ${company_id}, '${order_details}', ${date_time}, true, true);`
    },
    COMPANY: {
        SELECT_BY_CITY:
                city => `SELECT * from COMPANY WHERE city = '${city}'`,
        SELECT_ALL:
            () => `SELECT * FROM COMPANY;`,
        INSERT:
                c => `INSERT INTO COMPANY (id, name, phones, email, city, street, join_date, schedule, photos) VALUES
                      (DEFAULT, '${c.name}', '${c.phones}', '${c.email}', '${c.city}', '${c.street}', '${c.join_date}', '${c.schedule}', '${c.photos}' );`,
    },
    CUSTOMER: {
        SELECT_BY_EMAIL_AND_PASSWORD:
            (email, password) =>
                `select * from CUSTOMER where email = '${email}' and password = '${password}';`,
    },
    // INSERT: ``,
    // CREATE: ``,
    // DELETE: `DROP TABLE IF EXISTS COMPANY`,
}

module.exports = QUERY;