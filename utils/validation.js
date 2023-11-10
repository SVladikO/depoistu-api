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
            MIN: 10,
            MAX: 13
        },
        EMAIL: {
            MAX: 30
        }
    },
    MENU_ITEM: {
        NAME: {
            MIN: 2,
            MAX: 100
        },
        PRICE: {
            MIN: 1,
        },
        DESCRIPTION: {
            MAX: 300
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
            MAX: 60
        },
        PHONE: {
            MIN: 10,
            MAX: 13
        },
        SCHEDULE: {
            MIN: 7 //length 6 equal ',,,,,,'
        },
    }
};

const VALIDATION = {
    CUSTOMER: {
        name: Yup.string()
            .required(`Name is required!`)
            .min(FIELD_REQUIREMENTS_FOR.USER.NAME.MIN, `Name too Short! Min length ${FIELD_REQUIREMENTS_FOR.USER.NAME.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.USER.NAME.MAX, `Name too Long! Max length ${FIELD_REQUIREMENTS_FOR.USER.NAME.MAX}`),
        email: Yup.string()
            .email(`Invalid email`)
            .max(FIELD_REQUIREMENTS_FOR.USER.EMAIL.MAX, `Email too Long! Max length ${FIELD_REQUIREMENTS_FOR.USER.EMAIL.MAX}`)
            .required(`Email is required`),
        phone: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.USER.PHONE.MIN, `Example: 0971234567`)
            .max(FIELD_REQUIREMENTS_FOR.USER.PHONE.MAX, `Example: +380971234567`)
            .required(`Phone is required!`),
        password: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.USER.PASSWORD.MIN, `Password too Short! Min length ${FIELD_REQUIREMENTS_FOR.USER.PASSWORD.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.USER.PASSWORD.MAX, `Password too Long! Max length ${FIELD_REQUIREMENTS_FOR.USER.PASSWORD.MAX}`)
            .required(`Password is required`),
        isBusinessOwner: Yup.bool()
            .required(`isBusinessOwner is required`),
        emailVerificationCode: Yup.string().required(`Email verification code is required`),
    },
    MENU_ITEM: {
        id: Yup.string().required(`Id is required!`),
        isVisible: Yup.bool().required(`is_visible is required!`),
        categoryId: Yup.string().required(`Category id is required!`),
        companyId: Yup.string().required(`Company id is equired!`),
        name: Yup.string()
            .required(`Name is required!`)
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.NAME.MIN, `Name min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.NAME.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.MENU_ITEM.NAME.MAX, `Name max length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.NAME.MAX}`),
        description: Yup.string()
            .max(FIELD_REQUIREMENTS_FOR.MENU_ITEM.DESCRIPTION.MAX, `Description max length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.DESCRIPTION.MAX}`),
        size_1: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MIN, `Size 1 min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MAX, `Size 1 max length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MAX}`),
        price_1: Yup.string()
            .required(`Price is required!`)
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.PRICE.MIN, `Price 1 min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.PRICE.MIN}`),
        size_2: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MIN, `Size 2 min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MAX, `Size 2 max length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MAX}`),
        price_2: Yup.string()
            .required(`Price is required!`)
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.PRICE.MIN, `Price 2 min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.PRICE.MIN}`),
        size_3: Yup.string()
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MIN, `Size 3 min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MAX, `Size 3 max length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.MEAL_SIZE.MAX}`),
        price_3: Yup.string()
            .required(`Price is required!`)
            .min(FIELD_REQUIREMENTS_FOR.MENU_ITEM.PRICE.MIN, `Price 3 min length ${FIELD_REQUIREMENTS_FOR.MENU_ITEM.PRICE.MIN}`),
        imageUrl: Yup.string().required('Image url is required')
    },
    COMPANY: {
        id: Yup.number().required('Id is required'),
        customerId: Yup.number().required('Customer id is required'),
        name: Yup.string()
            .required('Name is required')
            .min(FIELD_REQUIREMENTS_FOR.COMPANY.NAME.MIN, `Name min length ${FIELD_REQUIREMENTS_FOR.COMPANY.NAME.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.COMPANY.NAME.MAX, `Name max length ${FIELD_REQUIREMENTS_FOR.COMPANY.NAME.MAX}`),
        cityId: Yup.string().required('City id is required'),
        street: Yup.string()
            .required('Street is required')
            .min(FIELD_REQUIREMENTS_FOR.COMPANY.STREET.MIN, `Street min length ${FIELD_REQUIREMENTS_FOR.COMPANY.STREET.MIN}`)
            .max(FIELD_REQUIREMENTS_FOR.COMPANY.STREET.MAX, `Street max length ${FIELD_REQUIREMENTS_FOR.COMPANY.STREET.MAX}`),
        phone1: Yup.string()
            .required()
            .min(FIELD_REQUIREMENTS_FOR.COMPANY.PHONE.MIN, `Phone 1 Example: 0971234567`)
            .max(FIELD_REQUIREMENTS_FOR.COMPANY.PHONE.MAX, `Phone 1 Example: +380971234567`),
        phone2: Yup.string()
            .max(FIELD_REQUIREMENTS_FOR.COMPANY.PHONE.MAX, `Phone 2 Example: +380971234567`),
        phone3: Yup.string()
            .max(FIELD_REQUIREMENTS_FOR.COMPANY.PHONE.MAX, `Phone 3 Example: +380971234567`),
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
            const {name, cityId, street, phone1, phone2, phone3, schedule} = VALIDATION.COMPANY;
            const validator = Yup.object().shape({name, cityId, street, phone1, phone2, phone3, schedule})
            return validator.validate(company)
        },
        UPDATE: company => {
            const {id, name, cityId, street, phone1, phone2, phone3, schedule} = VALIDATION.COMPANY;
            const validator = Yup.object().shape({id, name, cityId, street, phone1, phone2, phone3, schedule});

            return validator.validate(company);
        },
    },
    MENU_ITEM: {
        CREATE: menuItem => {
            const {categoryId, companyId, name, price, description, size, is_visible} = VALIDATION.MENU_ITEM;
            const validator = Yup.object().shape({categoryId, companyId, name, price, description, size, is_visible});
            return validator.validate(menuItem);
        },
        UPDATE: menuItem => {
            const {name, categoryId, price, description, size} = VALIDATION.MENU_ITEM;
            const validator = Yup.object().shape({name, categoryId, price, description, size});
            return validator.validate(menuItem);
        },
        UPDATE_IS_VISIBLE: menuItem => {
            const {id, isVisible} = VALIDATION.MENU_ITEM;
            const validator = Yup.object().shape({id, isVisible});
            return validator.validate(menuItem);
        },
    }
}

module.exports = {
    VALIDATOR,
    VALIDATION,
};
