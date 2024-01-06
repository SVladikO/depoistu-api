const QueryUtils = {
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
                          where company_id = ${companyId}
                            and is_visible = 1;`,
        SELECT_CATEGORY_ID_BY_COMPANY_ID:
            companyId => `select category_id
                          from MENU_ITEM
                          where company_id = ${companyId};`,
        SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID:
            (companyId, categoryId) => `select *
                                        from MENU_ITEM
                                        where category_id = ${categoryId}
                                          and company_id = ${companyId};`,
        INSERT: mi => `INSERT INTO MENU_ITEM (id,
                                              category_id,
                                              company_id,
                                              name,
                                              description,
                                              size_1,
                                              price_1,
                                              size_2,
                                              price_2,
                                              size_3,
                                              price_3,
                                              image_url,
                                              is_visible)
                       VALUES (default,
                               '${mi.categoryId}',
                               '${mi.companyId}',
                               '${mi.name}',
                               '${mi.description}',
                               '${mi.size_1}',
                               '${mi.price_1}',
                               '${mi.size_2}',
                               '${mi.price_2}',
                               '${mi.size_3}',
                               '${mi.price_3}',
                               '${mi.imageUrl}',
                               '${mi.isVisible}
                               ');`,
        UPDATE: mi => `UPDATE MENU_ITEM
                       SET name        = '${mi.name}',
                           description = '${mi.description}',
                           category_id = '${mi.categoryId}',
                           size_1      = '${mi.size_1}',
                           price_1     = '${mi.price_1}',
                           size_2      = '${mi.size_2}',
                           price_2     = '${mi.price_2}',
                           size_3      = '${mi.size_3}',
                           price_3     = '${mi.price_3}',
                           image_url   = '${mi.imageUrl}'
                       WHERE id = ${mi.id}
        `,
        UPDATE_IS_VISIBLE: mi => `UPDATE MENU_ITEM
                                  SET is_visible = '${mi.isVisible}'
                                  WHERE id = ${mi.id};`,
        DELETE_BY_MENU_ITEM_ID: id => `DELETE
                                       FROM MENU_ITEM
                                       WHERE ID = ${id}`,
        DELETE_BY_COMPANY_ID: id => `DELETE
                                     FROM MENU_ITEM
                                     WHERE company_id = ${id}`,
        CHECK_OWNERSHIP_SELECT_BY_CUSTOMER_ID_AND_MENU_ITEM_ID: (customerId, menuItemId) => `
            SELECT MENU_ITEM.NAME
            FROM MENU_ITEM
                     JOIN COMPANY
                          ON MENU_ITEM.COMPANY_ID = COMPANY.ID
                     JOIN CUSTOMER
                          ON CUSTOMER.ID = COMPANY.CUSTOMER_ID
            WHERE CUSTOMER.ID = ${customerId}
              AND MENU_ITEM.ID = ${menuItemId};
        `
    },
    ORDER_HISTORY_DETAILS: {
        INSERT: (order_items, order_history_id) =>
            `INSERT INTO ORDER_HISTORY_DETAILS (ID,
                                                ORDER_HISTORY_ID,
                                                MENU_ITEM_ID,
                                                AMOUNT_1,
                                                AMOUNT_2,
                                                AMOUNT_3,
                                                PRICE_1,
                                                PRICE_2,
                                                PRICE_3)
             VALUES
                 ${
                         order_items.reduce(
                                 (
                                         accumulator,
                                         {
                                             id,
                                             amount1 = 0,
                                             amount2 = 0,
                                             amount3 = 0,
                                             price1 = 0,
                                             price2 = 0,
                                             price3 = 0
                                         },
                                         index
                                 ) =>
                                         accumulator +
                                         `(DEFAULT, ${order_history_id}, ${id}, ${amount1}, ${amount2}, ${amount3}, ${price1}, ${price2}, ${price3})${order_items.length !== index + 1 ? ', ' : ';'}`,
                                 '')
                 }`,
        SELECT_ALL_BY_ORDER_HISTORY_ID: orderHistoryId => `
            SELECT
                ORDER_HISTORY_DETAILS.ID,
                ORDER_HISTORY_DETAILS.AMOUNT_1,
                ORDER_HISTORY_DETAILS.AMOUNT_2,
                ORDER_HISTORY_DETAILS.AMOUNT_3,
                ORDER_HISTORY_DETAILS.PRICE_1,
                ORDER_HISTORY_DETAILS.PRICE_2,
                ORDER_HISTORY_DETAILS.PRICE_3,
                MENU_ITEM.SIZE_1,
                MENU_ITEM.SIZE_2,
                MENU_ITEM.SIZE_3,
                MENU_ITEM.IMAGE_URL,
                MENU_ITEM.DESCRIPTION,
                MENU_ITEM.NAME
            from ORDER_HISTORY_DETAILS
                     JOIN MENU_ITEM on ORDER_HISTORY_DETAILS.MENU_ITEM_ID = MENU_ITEM.ID
            WHERE ORDER_HISTORY_DETAILS.ORDER_HISTORY_ID = ${orderHistoryId};
        `
    },
    ORDER_HISTORY: {
        SELECT_ALL_BY_CUSTOMER_ID: customer_id => `
            SELECT ORDER_HISTORY.ID,
                   ORDER_HISTORY.CUSTOMER_ID,
                   ORDER_HISTORY.COMPANY_ID,
                   ORDER_HISTORY.DATE,
                   ORDER_HISTORY.TOTAL,
                   COMPANY.CITY_ID,
                   COMPANY.NAME
            from ORDER_HISTORY
                     JOIN COMPANY on ORDER_HISTORY.COMPANY_ID = COMPANY.ID
            WHERE ORDER_HISTORY.CUSTOMER_ID = ${customer_id};
        `,
        INSERT: (orderHistory) =>
            `INSERT INTO ORDER_HISTORY (ID, CUSTOMER_ID, COMPANY_ID, TOTAL, DATE)
             VALUES (DEFAULT, ${orderHistory.customer_id}, ${orderHistory.company_id}, '${orderHistory.total}',
                     ${orderHistory.date});`
    },
    FAVORITE_COMPANY: {
        SELECT_BY_CUSTOMER_ID: customerId => `SELECT COMPANY.ID,
                                                     COMPANY.NAME,
                                                     COMPANY.PHONE1,
                                                     COMPANY.PHONE2,
                                                     COMPANY.PHONE3,
                                                     COMPANY.PHOTOS,
                                                     COMPANY.CITY_ID,
                                                     COMPANY.STREET,
                                                     COMPANY.LATITUDE,
                                                     COMPANY.LONGITUDE,
                                                     COMPANY.SCHEDULE
                                              from FAVORITE_COMPANY
                                                       INNER JOIN COMPANY on FAVORITE_COMPANY.COMPANY_ID = COMPANY.ID
                                              WHERE FAVORITE_COMPANY.customer_id = '${customerId}';`,
        ADD: (customer_id, company_id) => `INSERT INTO FAVORITE_COMPANY (customer_id, company_id)
                                           values (${customer_id}, ${company_id})`,
        DELETE: (customer_id, company_id) => `DELETE
                                              FROM FAVORITE_COMPANY
                                              WHERE customer_id = ${customer_id}
                                                and company_id = ${company_id}`,
    },
    COMPANY: {
        SELECT_BY_CUSTOMER_ID: customerId => `SELECT *
                                              from COMPANY
                                              WHERE customer_id = '${customerId}';`,
        SELECT_AVAILABLE_CITIES: () => `SELECT DISTINCT COMPANY.CITY_ID
                                        FROM COMPANY
                                                 JOIN MENU_ITEM on COMPANY.ID = MENU_ITEM.COMPANY_ID
                                        WHERE MENU_ITEM.IS_VISIBLE = 1;`,
        SELECT_BY_CITY_ID: cityId => `SELECT DISTINCT COMPANY.ID,
                                                      COMPANY.NAME,
                                                      COMPANY.PHONE1,
                                                      COMPANY.PHONE2,
                                                      COMPANY.PHONE3,
                                                      COMPANY.PHOTOS,
                                                      COMPANY.CITY_ID,
                                                      COMPANY.STREET,
                                                      COMPANY.LATITUDE,
                                                      COMPANY.LONGITUDE,
                                                      COMPANY.SCHEDULE
                                      from COMPANY
                                               JOIN MENU_ITEM on COMPANY.ID = MENU_ITEM.COMPANY_ID
                                      WHERE CITY_ID = '${cityId}'
                                        AND MENU_ITEM.IS_VISIBLE = 1;`,
        SELECT_ALL_COMPANIES: cityId => `SELECT DISTINCT COMPANY.ID,
                                                         COMPANY.NAME,
                                                         COMPANY.PHONE1,
                                                         COMPANY.PHONE2,
                                                         COMPANY.PHONE3,
                                                         COMPANY.PHOTOS,
                                                         COMPANY.CITY_ID,
                                                         COMPANY.STREET,
                                                         COMPANY.LATITUDE,
                                                         COMPANY.LONGITUDE,
                                                         COMPANY.SCHEDULE
                                         FROM COMPANY
                                                  JOIN MENU_ITEM on COMPANY.ID = MENU_ITEM.COMPANY_ID
                                         WHERE MENU_ITEM.IS_VISIBLE = 1;`,
        // CHECK OWNERSHIP...
        CHECK_OWNERSHIP_SELECT_BY_COMPANY_ID_AND_CUSTOMER_ID: (company_id, customer_id) => `SELECT *
                                                                                            from COMPANY
                                                                                            WHERE id = '${company_id}'
                                                                                              and customer_id = '${customer_id}';`,
        SELECT_BY_COMPANY_ID: companyId => `SELECT *
                                            from COMPANY
                                            WHERE id = '${companyId}';`,
        SELECT_ALL: () => `SELECT *
                           FROM COMPANY;`,
        INSERT: c => `INSERT INTO COMPANY
                      (id, customer_id, name, phone1, phone2, phone3, photos, city_id, street, latitude, longitude,
                       join_date, schedule)
                      VALUES (DEFAULT,
                              '${c.customerId}',
                              '${c.name}',
                              '${c.phone1}',
                              '${c.phone2}',
                              '${c.phone3}',
                              '${c.photos}',
                              '${c.cityId}',
                              '${c.street}',
                              '${c.latitude}',
                              '${c.longitude}',
                              '${c.joinDate}',
                              '${c.schedule}')
        ;`,

        UPDATE: c => `UPDATE COMPANY
                      SET name      = '${c.name}',
                          phone1    = '${c.phone1}',
                          phone2    = '${c.phone2}',
                          phone3    = '${c.phone3}',
                          photos    = '${c.photos}',
                          city_id   = '${c.cityId}',
                          street    = '${c.street}',
                          latitude  = '${c.latitude}',
                          longitude = '${c.longitude}',
                          schedule  = '${c.schedule}'
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
        CHANGE_IS_BUSINESS_OWNER: (id, isBusinessOwner) =>
            `UPDATE CUSTOMER
             SET is_business_owner = ${isBusinessOwner}
             where id = '${id}'`,
        SET_IS_VERIFFIED_EMAIL_TRUE: (email) =>
            `UPDATE CUSTOMER
             SET is_verified_email = true
             where email = '${email}'`,
        SELECT_BY_EMAIL: email => `select *
                                   from CUSTOMER
                                   where email = '${email}';`,

        INSERT: c => {
            const t = `INSERT INTO CUSTOMER (id, name, phone, password, email, join_date, is_business_owner,
                                             can_create_companies)
                       VALUES (DEFAULT,
                               '${c.name}',
                               '${c.phone}',
                               '${c.password}',
                               '${c.email}',
                               '${c.join_date}',
                               '${+c.isBusinessOwner}',
                               '${c.can_create_companies}')
            ;`
            return t;
        },
        UPDATE_PASSWORD: c => `UPDATE CUSTOMER
                               SET password = '${c.newPassword}'
                               WHERE email = '${c.email}'
        ;`,
    },
    // INSERT: ``,
    // CREATE: ``,
    // DELETE: `DROP TABLE IF EXISTS COMPANY`,
}

module.exports = QueryUtils;