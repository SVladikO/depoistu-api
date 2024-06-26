const SELECTED_LANGUAGE_ON_FE = "current-language";

const throwError = (translationKey, req) => {
    throw resolveError(translationKey, req)
}

const resolveError = (translationKey, req) => {
    const selectedLanguageOnFE = req.headers[SELECTED_LANGUAGE_ON_FE];

    const errorObject = ERROR_TRANSLATION[translationKey];

    //If translationKey doesn't exist
    if (!errorObject) {
        return {
            message: translationKey + ' ' + selectedLanguageOnFE,
            status: 500
        }
    }

    return {
        message: errorObject?.message[selectedLanguageOnFE || 'en'],
        status: errorObject.status
    }
}

const ERROR_TRANSLATION = {
    "CUSTOMER.TOKEN.REQUIRED": {
        message: {
            en: "A token is required. Check 'Are you signed in?'.",
            ua: "Для даної операції потрібен токен. Перевірте чи ви залогінились."
        },
        status: 401,
    },
    "CUSTOMER.TOKEN.INVALID": {
        message: {
            en: "Invalid Token. Check 'Are you signed in?'.",
            ua: "Пошкоджений токен. Перевірте чи ви залогінились."
        },
        status: 401,
    },
    "CUSTOMER.TOKEN.FAKE": {
        message: {
            en: "Verification is failed. Check 'Are you signed in?'.",
            ua: 'Доступ обмежено. Перевірте чи ви залогінились.',
        },
        status: 401,
    },
    "CUSTOMER.EMAIL_USED": {
        message: {
            en: "This email is already used. Please login if you remember password.",
            ua: "Даний email уже використовується. Ви можете ввійти в систему якщо памятаєте пароль.",
        },
        status: 400,
    },
    "CUSTOMER.WRONG_OLD_PASSWORD": {
        message: {
            en: "Wrong old password.",
            ua: "Не вірний старий пароль.",
        },
        status: 400,
    },
    "CUSTOMER.WRONG_EMAIL_VERIFICATION_CODE": {
        message: {
            en: 'Wrong email verification code.',
            ua: "Не вірний код веріфікації email.",
        },
        status: 400,
    },
    "CUSTOMER.WRONG_CREDENTIALS": {
        message: {
            en: "Wrong credentials. Customer doesn't exist.",
            ua: "Не правильні логін чи пароль. Клієн не існує.",
        },
        status: 401,
    },
    "IMAGE.CREATE.ERROR": {
        message: {
            en: "Create image error.",
            ua: "Помилка при додаванні зображення."
        },
        status: 404,
    },
    "COMPANY.CITY_ID_REQUIRED": {
        message: {
            en: "Bad request. City id is required",
            ua: "Не правильний запит. City id обовязкове.",
        },
        status: 400,
    },
    "COMPANY.COMPANY_ID_REQUIRED": {
        message: {
            en: "Bad request. Company id is required",
            ua: "Не правильний запит. Company id обовязкове.",
        },
        status: 400,
    },
    "BROKEN_VERSION_CONSISTENCY": {
        message: {
            en: "Reload page.",
            ua: "Перезагрузіть сайт.",
        },
        status: 408,
    },
    "COMPANY.CUSTOMER_ID_REQUIRED": {
        message: {
            en: "Bad request. Customer id is required",
            ua: "Не правильний запит. Customer id обовязкове.",
        },
        status: 400,
    },
    "COMPANY.ONLY_OWNER_CAN": {
        message: {
            en: "Only company owner can edit information.",
            ua: "Тільки власник закладу може змінювати інформацію.",
        },
        status: 403,
    },
    "COMPANY.MAX_COMPANY_AMOUNT": {
        message: {
            en: "You can create only 1 company. If you need more contact us by email.",
            ua: "Ви можете створити один заклад. Якщо вам потрібно більше напишіть нам на email.",
        },
        status: 400,
    },
    "COMPANY.NO_MENU": {
        message: {
            en: "Menu wasn't found.",
            ua: "Меню не знайдено.",
        },
        status: 400,
    },
    "COMPANY.DESNT_EXIST": {
        message: {
            en: "Company wasn't found.",
            ua: "Заклад не знайдено.",
        },
        status: 400,
    },
    "MENU_ITEM.COMPANY_ID_REQUIRED": {
        message: {
            en: "Bad request. company_id is required",
            ua: "Не правильний запит. company_id обовязкове.",
        },
        status: 400,
    },
    "MENU_ITEM.ONLY_OWNER_CAN": {
        message: {
            en: "Only owner can bring changes.",
            ua: "Тільки власник може вносити зміни.",
        },
        status: 403,
    },
}

module.exports = {
    throwError,
    resolveError,
    SELECTED_LANGUAGE_ON_FE,
}