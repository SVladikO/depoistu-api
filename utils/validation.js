const Yup = require('yup');

const FIELD_REQUIREMENTS_FOR = {
    USER: {
        NAME: {
            MIN: 2,
            MAX: 30
        },
        PASSWORD: {
            MIN: 6,
            MAX: 12
        },
        PHONE: {
            MIN: 12,
            MAX: 12
        },
        EMAIL: {
            MAX: 30
        }
    },
    MENU_ITEM: {
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
    },
    COMPANY: {
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
            MIN: 12,
            MAX: 12
        },
        SCHEDULE: {
            MIN: 7 //length 6 equal ',,,,,,'
        },
    }
};

const VALIDATION = {
    CUSTOMER: {
        name: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.USER.NAME.MIN, `Too Short! Min length ${FIELD_REQUIREMENTS_FOR.USER.NAME.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.USER.NAME.MAX, `Too Long! Max length ${FIELD_REQUIREMENTS_FOR.USER.NAME.MAX}`)
            .required(`Name is required!`),
        email: Yup.string()
            .email(`Invalid email`)
            .max(FIELD_REQUIREMENTS_FOR.USER.EMAIL.MAX, `Too Long! Max length ${FIELD_REQUIREMENTS_FOR.USER.EMAIL.MAX}`)
            .required(`Email is required`),
        phone: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.USER.PHONE.MIN, `Example: 380971234567`)
            .max(FIELD_REQUIREMENTS_FOR.USER.PHONE.MAX, `Example: 380971234567`)
            .required(`Phone is required!`),
        password: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.USER.PASSWORD.MIN, `Too Short! Min length ${FIELD_REQUIREMENTS_FOR.USER.PASSWORD.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.USER.PASSWORD.MAX, `Too Long! Max length ${FIELD_REQUIREMENTS_FOR.USER.PASSWORD.MAX}`)
            .required(`Password is required`),
        emailVerificationCode: Yup.string().required(`Email verification code is required`),
    },
    MENU_ITEM: {
        category_id: Yup.string().required(`Category id is required!`),
        company_id: Yup.string().required(`Company id is equired!`),
        name: Yup.string()
            .required(`Name is required!`)
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.NAME.MIN, `Min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.NAME.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.MENU_ITEM.NAME.MAX, `Max length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.NAME.MAX}`),
        price: Yup.string()
            .required(`Price is required!`)
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.PRICE.MIN, `Min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.PRICE.MIN}`),
        description: Yup.string()
            .max(FIELD_REQUIREMENTS_FOR.MENU_ITEM.DESCRIPTION.MAX, `Max length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.DESCRIPTION.MAX}`),
        cookingTime: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.COOKING_TIME.MIN, `Min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.COOKING_TIME.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.MENU_ITEM.COOKING_TIME.MAX, `Max length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.COOKING_TIME.MAX}`),
        size: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MIN, `Min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MAX, `Max length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MAX}`)
    },
    COMPANY: {
        customer_id: Yup.number().required('Customer id is required'),
        name: Yup.string()
            .required('Name is required')
            .min(FIELD_REQUIREMENTS_FOR.COMPANY.NAME.MIN, `Min length ${FIELD_REQUIREMENTS_FOR.COMPANY.NAME.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.COMPANY.NAME.MAX, `Max length ${FIELD_REQUIREMENTS_FOR.COMPANY.NAME.MAX}`),
        city_id: Yup.string().required('City id is required'),
        street: Yup.string()
            .required('Street is required')
            .min(FIELD_REQUIREMENTS_FOR.COMPANY.STREET.MIN, `Min length ${FIELD_REQUIREMENTS_FOR.COMPANY.STREET.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.COMPANY.STREET.MAX, `Max length ${FIELD_REQUIREMENTS_FOR.COMPANY.STREET.MAX}`),
        phone: Yup.string()
            .required()
            .min(FIELD_REQUIREMENTS_FOR.COMPANY.PHONE.MIN, `Example: 380971234567`)
            .max(FIELD_REQUIREMENTS_FOR.COMPANY.PHONE.MAX, `Example: 380971234567`),
        schedule: Yup.string()
            .required('Schedule is required')
            .min(FIELD_REQUIREMENTS_FOR.COMPANY.SCHEDULE.MIN, 'Schedule should not be empty. Minimum one day should be scheduled.')
    }
}

const VALIDATOR = {
    CUSTOMER: {
        SING_UP: customer => {
            const {name, email, phone, password} = VALIDATION.CUSTOMER;
            const validator = Yup.object().shape({name, email, phone, password})
            return validator.validate(customer)
        },
        CHANGE_PASSWORD: customer => {
            const {password, email} = VALIDATION.CUSTOMER;

            const validator = Yup.object().shape({password, email, newPassword: password})
            return validator.validate(customer)
        },
        VALIDATE_EMAIL: customer => {
            const {email, emailVerificationCode} = VALIDATION.CUSTOMER;

            const validator = Yup.object().shape({email, emailVerificationCode})
            return validator.validate(customer)
        },
    },
    COMPANY: {
        CREATE: company => {
            const validator = Yup.object().shape(VALIDATION.COMPANY)
            return validator.validate(company)
        },
        UPDATE: company => {
            const {name, city_id, street, phone, schedule} = VALIDATION.COMPANY;
            const validator = Yup.object().shape({name, city_id, street, phone, schedule});

            return validator.validate(company);
        },
    },
    MENU_ITEM: {
        CREATE: menuItem => {
            const validator = Yup.object().shape(VALIDATION.MENU_ITEM);
            return validator.validate(menuItem);
        },
        UPDATE: menuItem => {
            const {name, category_id, price, description, cookingTime, size} = VALIDATION.MENU_ITEM;
            const validator = Yup.object().shape({name, category_id, price, description, cookingTime, size});
            return validator.validate(menuItem);
        },
    }
}

module.exports = VALIDATOR;
