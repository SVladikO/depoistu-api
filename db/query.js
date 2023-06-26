const QUERY = {
    MENU_ITEM: {
        SELECT_BY_ID: companyId => `SELECT *
                                    from MENU_ITEM
                                    WHERE id = '${companyId}';`,
        SELECT_ALL_BY_COMPANY_ID:
            companyId => `select *
                          from MENU_ITEM
                          where company_id = ${companyId};`,
        SELECT_CATEGORY_ID_BY_COMPANY_ID:
            companyId => `select category_id
                          from MENU_ITEM
                          where company_id = ${companyId};`,
        SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID:
            (companyId, categoryId) => `select *
                                        from MENU_ITEM
                                        where category_id = ${categoryId}
                                          and company_id = ${companyId};`,
        INSERT: mi => `INSERT INTO MENU_ITEM (id, category_id, company_id, name, description, cooking_time, price, size,
                                              image_url)
                       VALUES (default, '${mi.category_id}', '${mi.company_id}', '${mi.name}', '${mi.description}',
                               '${mi.cookingTime}', '${mi.price}', '${mi.size}', '${mi.image_url}');`,
        UPDATE: mi => `UPDATE MENU_ITEM
                       SET name         = '${mi.name}',
                           description  = '${mi.description}',
                           cooking_time = '${mi.cookingTime}',
                           price        = '${mi.price}',
                           size         = '${mi.size}',
                           image_url    = '${mi.image_url}'
                       WHERE id = ${mi.id}
        `,
        DELETE_BY_MENU_ITEM_ID: id => `DELETE
                                       FROM MENU_ITEM
                                       WHERE ID = ${id}`,
    },
    HISTORY: {
        INSERT: (customer_id, company_id, order_details, date_time) =>
            `INSERT INTO HISTORY (id, CUSTOMER_ID, COMPANY_ID, ORDER_DETAILS, DATE_TIME, is_paid, is_prepared)
             VALUES (DEFAULT, ${customer_id}, ${company_id}, '${order_details}', ${date_time}, true, true);`
    },
    COMPANY: {
        SELECT_BY_CUSTOMER_ID: customerId => `SELECT *
                                              from COMPANY
                                              WHERE customer_id = '${customerId}';`,
        SELECT_AVAILABLE_CITIES: () => `SELECT DISTINCT CITY_ID FROM COMPANY;`,
        SELECT_BY_CITY_ID: city_id => `SELECT *
                                    from COMPANY
                                    WHERE CITY_ID = '${city_id}';`,
        SELECT_BY_COMPANY_ID: companyId => `SELECT *
                                            from COMPANY
                                            WHERE id = '${companyId}';`,
        SELECT_ALL: () => `SELECT *
                           FROM COMPANY;`,
        INSERT: c => `INSERT INTO COMPANY (id, customer_id, name, phone, city_id, street, join_date, schedule)
                      VALUES (DEFAULT,
                              '${c.customer_id}',
                              '${c.name}',
                              '${c.phone}',
                              '${c.city_id}',
                              '${c.street}',
                              '${c.join_date}',
                              '${c.schedule}')
        ;`,
        UPDATE: c => `UPDATE COMPANY
                      SET name     = '${c.name}',
                          phone    = '${c.phone}',
                          city_id     = '${c.city_id}',
                          street   = '${c.street}',
                          schedule = '${c.schedule}'
                      WHERE id = ${c.id}
        ;`,
        DELETE_BY_COMPANY_ID: id => `DELETE
                                     FROM COMPANY
                                     WHERE ID = ${id}`,

    },
    CUSTOMER: {
        SELECT_BY_EMAIL_AND_PASSWORD: (email, password) =>
            `select *
             from CUSTOMER
             where email = '${email}'
               and password = '${password}';`,

        SELECT_BY_EMAIL: email => `select *
                                   from CUSTOMER
                                   where email = '${email}';`,

        INSERT: c => `INSERT INTO CUSTOMER (id, name, phone, password, email, join_date)
                      VALUES (DEFAULT,
                              '${c.name}',
                              '${c.phone}',
                              '${c.password}',
                              '${c.email}',
                              '${c.join_date}')
        ;`,
        UPDATE_PASSWORD: c => `UPDATE CUSTOMER
                      SET password = '${c.newPassword}' 
                      WHERE email = '${c.email}'
        ;`,
    },
    // INSERT: ``,
    // CREATE: ``,
    // DELETE: `DROP TABLE IF EXISTS COMPANY`,
}

module.exports = QUERY;