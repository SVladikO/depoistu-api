const QUERY = {
    MENU_ITEM: {
        SELECT_BY_ID: companyId => `SELECT *
                                    from MENU_ITEM
                                    WHERE id = '${companyId}';`,
        SELECT_ALL_BY_COMPANY_ID:
            companyId => `select *
                          from MENU_ITEM
                          where company_id = ${companyId};`,
        SELECT_ALL_ONLY_VISIABLE_BY_COMPANY_ID:
            companyId => `select *
                          from MENU_ITEM
                          where company_id = ${companyId} and is_visible=1;`,
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
                                              image_url, is_visible)
                       VALUES (default, '${mi.category_id}', '${mi.company_id}', '${mi.name}', '${mi.description}',
                               '${mi.cookingTime}', '${mi.price}', '${mi.size}', '${mi.image_url}', '${mi.is_visible}');`,
        UPDATE: mi => `UPDATE MENU_ITEM
                       SET name         = '${mi.name}',
                           description  = '${mi.description}',
                           category_id  = '${mi.category_id}',
                           cooking_time = '${mi.cookingTime}',
                           price        = '${mi.price}',
                           size         = '${mi.size}',
                           image_url    = '${mi.image_url}'
                       WHERE id = ${mi.id}
        `,
        UPDATE_IS_VISIBLE: mi => `UPDATE MENU_ITEM
                       SET is_visible   = '${mi.is_visible}'
                       WHERE id = ${mi.id}
        `,
        DELETE_BY_MENU_ITEM_ID: id => `DELETE
                                       FROM MENU_ITEM
                                       WHERE ID = ${id}`,
        DELETE_BY_COMPANY_ID: id => `DELETE
                                       FROM MENU_ITEM
                                       WHERE company_id = ${id}`,
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
        SELECT_AVAILABLE_CITIES: () => `SELECT DISTINCT COMPANY.CITY_ID
                                        FROM COMPANY
                                                 JOIN MENU_ITEM on COMPANY.ID = MENU_ITEM.COMPANY_ID;`,
        SELECT_BY_CITY_ID: city_id => `SELECT *
                                       from COMPANY
                                                JOIN MENU_ITEM on COMPANY.ID = MENU_ITEM.COMPANY_ID
                                       WHERE CITY_ID = '${city_id}';`,
        // CHECK OWNERSHIP...
        CHECK_OWNERSHIP_SELECT_BY_COMPANY_ID_AND_CUSTOMER_ID: (company_id, customer_id) => `SELECT *
                                                                                            from COMPANY
                                       WHERE id = '${company_id}' and customer_id = '${customer_id}';`,
        SELECT_BY_COMPANY_ID: companyId => `SELECT *
                                            from COMPANY
                                            WHERE id = '${companyId}';`,
        SELECT_ALL: () => `SELECT *
                           FROM COMPANY;`,
        INSERT: c => `INSERT INTO COMPANY (id, customer_id, name, phone1, phone2, phone3, city_id, street, join_date, schedule)
                      VALUES (DEFAULT,
                              '${c.customer_id}',
                              '${c.name}',
                              '${c.phone1}',
                              '${c.phone2}',
                              '${c.phone3}',
                              '${c.city_id}',
                              '${c.street}',
                              '${c.join_date}',
                              '${c.schedule}')
        ;`,
        UPDATE: c => `UPDATE COMPANY
                      SET name     = '${c.name}',
                          phone1    = '${c.phone1}',
                          phone2    = '${c.phone2}',
                          phone3    = '${c.phone3}',
                          city_id  = '${c.city_id}',
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
        SELECT_BY_ID_AND_EMAIL_AND_PASSWORD: (id, email, password) =>
            `select *
             from CUSTOMER
             where id = '${id}'
               and email = '${email}'
               and password = '${password}';`,
        SELECT_BY_EMAIL_AND_EMAIL_VERIFICATION_CODE: (email, verification_code) =>
            `select *
             from CUSTOMER
             where email = '${email}'
               and join_date = '${verification_code}';`,
        SET_IS_VERIFFIED_EMAIL_TRUE: (email) =>
            `UPDATE CUSTOMER
             SET is_verified_email = true
             where email = '${email}'`,
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