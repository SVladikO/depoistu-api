const Yup  = require('yup');

const USER = {
    NAME: {
        MIN: 2,
        MAX: 30
    },
    PASSWORD: {
        MIN: 6,
        MAX: 12
    },
    PHONE: {
        MIN: 13,
        MAX: 13
    },
    EMAIL: {
        MAX: 30
    }
};

const user_validation = {
    name: Yup.string()
        .min(USER.NAME.MIN, `Too Short! Min length ${USER.NAME.MIN}`)
        .max(USER.NAME.MAX, `Too Long! Max length ${USER.NAME.MAX}`)
        .required(`Required!`),
    password: Yup.string()
        .min(USER.PASSWORD.MIN, `Too Short! Min length ${USER.PASSWORD.MIN}`)
        .max(USER.PASSWORD.MAX, `Too Long! Max length ${USER.PASSWORD.MAX}`)
        .required(`Required`),
    email: Yup.string()
        .email(`Invalid email`)
        .max(USER.EMAIL.MAX, `Too Long! Max length ${USER.EMAIL.MAX}`)
        .required(`Required`),
    phone: Yup.string()
        .min(USER.PHONE.MIN, `Example: +380971234567`)
        .max(USER.PHONE.MAX, `Example: +380971234567`)
        .required(`Required!`),
    confirmedPassword: Yup.string()
        .required(`Required!`)
        .min(USER.PASSWORD.MIN, `Too Short! Min length ${USER.PASSWORD.MIN}`)
        .max(USER.PASSWORD.MAX, `Too Long! Max length ${USER.PASSWORD.MAX}`)
        .test(`passwords-match`, `Passwords must match`, function (value) {
            return this.parent.newPassword === value
        })
}

const MENU_ITEM = {
    NAME: {
        MIN: 2,
        MAX: 30
    },
    PRICE: {
        MIN: 1,
    },
    DESCRIPTION: {
        MAX: 100
    },
    COOKING_TIME: {
        MIN: 1,
        MAX: 2
    },
    MEAL_SIZE: {
        MIN: 1,
        MAX: 4
    },
};

const menu_item_validation = {
    name: Yup.string()
        .required(`Required!`)
        .min(MENU_ITEM.NAME.MIN, `Min length ${MENU_ITEM.NAME.MIN}`)
        .max(MENU_ITEM.NAME.MAX, `Max length ${MENU_ITEM.NAME.MAX}`),
    price: Yup.string()
        .required(`Required!`)
        .min(MENU_ITEM.PRICE.MIN, `Min length ${MENU_ITEM.PRICE.MIN}`),
    description: Yup.string()
        .max(MENU_ITEM.DESCRIPTION.MAX, `Max length ${MENU_ITEM.DESCRIPTION.MAX}`),
    cookingTime: Yup.string()
        .min(MENU_ITEM.COOKING_TIME.MIN, `Min length ${MENU_ITEM.COOKING_TIME.MIN}`)
        .max(MENU_ITEM.COOKING_TIME.MAX, `Max length ${MENU_ITEM.COOKING_TIME.MAX}`),
    size: Yup.string()
        .min(MENU_ITEM.MEAL_SIZE.MIN, `Min length ${MENU_ITEM.MEAL_SIZE.MIN}`)
        .max(MENU_ITEM.MEAL_SIZE.MAX, `Max length ${MENU_ITEM.MEAL_SIZE.MAX}`)
}

const COMPANY = {
    NAME: {
        MIN: 2,
        MAX: 30
    },
    CITY: {
        //we take city from the exist list
    },
    STREET: {
        MIN: 2,
        MAX: 30
    },
    PHONE: {
        MIN: 10,
        MAX: 10
    },
    SCHEDULE: {
        MIN: 7 //length 6 equal ',,,,,,'
    },
};

const company_validation = {
    customer_id: Yup.number().required(),
    name: Yup.string()
        .required()
        .min(COMPANY.NAME.MIN, `Min length ${COMPANY.NAME.MIN}`)
        .max(COMPANY.NAME.MAX, `Max length ${COMPANY.NAME.MAX}`),
    city: Yup.string().required(),
    street: Yup.string()
        .required()
        .min(COMPANY.STREET.MIN, `Min length ${COMPANY.STREET.MIN}`)
        .max(COMPANY.STREET.MAX, `Max length ${COMPANY.STREET.MAX}`),
    phone: Yup.string()
        .required()
        .min(COMPANY.PHONE.MIN, `Example: 0971234567`)
        .max(COMPANY.PHONE.MAX, `Example: 0971234567`),
    schedule: Yup.string()
        .required()
        .min(COMPANY.SCHEDULE.MIN, 'Schedule should not be empty. Minimum one day should be scheduled.')
}

const companyUpdateValidation = company => {
    const {name, city, street, phone, schedule} = company_validation;
    const validator = Yup.object().shape({name, city, street, phone, schedule});

    return validator.validate(company);
};

const companyCreateValidation = company => {
    const {customer_id, name, city, street, phone, schedule} = company_validation;
    const validator = Yup.object().shape({customer_id, name, city, street, phone, schedule})

    return validator.validate(company)
}

module.exports = {
    companyUpdateValidation,
    companyCreateValidation
}