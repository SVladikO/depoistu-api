const SELECTED_LANGUAGE_ON_FE = "current-language";

const resolve = (translationObject, req) => {
    const currentLanguage = req.headers[SELECTED_LANGUAGE_ON_FE];

    console.log('RESOLVE TRANSLATION:')
    console.log(translationObject)
    console.log('currentLanguage: ', currentLanguage)

    if (!currentLanguage) {
        return translationObject['en']
    }


    return translationObject[currentLanguage];
}

const resolveError = (translationKey, req) => {
    const selectedLanguageOnFE = req.headers[SELECTED_LANGUAGE_ON_FE];

    //If translationKey is broken
    if (!ERROR_TRANSLATION[translationKey]) {
        return {
            errorMessage: translationKey + ' ' + selectedLanguageOnFE,
        }
    }

    // If selectedLanguageOnFE isn't set
    if (!selectedLanguageOnFE) {
        return {
            errorMessage: ERROR_TRANSLATION[translationKey]?.errorMessage['en'],
            status: ERROR_TRANSLATION[translationKey].status
        }
    }

    return {
        errorMessage: ERROR_TRANSLATION[translationKey]?.errorMessage[selectedLanguageOnFE],
        status: ERROR_TRANSLATION[translationKey].status
    }
}

const throwError = (translationKey, req) => {
    const {errorMessage, status} = resolveError(translationKey, req)

    throw new Error(errorMessage, {status})
}

const ERROR_TRANSLATION = {
    "CUSTOMER.TOKEN.REQUIRED": {
        errorMessage: {
            en: "A token is required. Check 'Are you signed in?'.",
            ua: "Для даної операції потрібен токен. Перевірте чи ви залогінились."
        },
        status: 401,
    },
    "CUSTOMER.TOKEN.INVALID": {
        errorMessage: {
            en: "Invalid Token. Check 'Are you signed in?'.",
            ua: "Пошкоджений токен. Перевірте чи ви залогінились."
        },
        status: 401,
    },
    "CUSTOMER.TOKEN.FAKE": {
        errorMessage: {
            en: "Verification is failed. Check 'Are you signed in?'.",
            ua: 'Доступ обмежено. Перевірте чи ви залогінились.',
        },
        status: 401,
    },
    "CUSTOMER.EMAIL_USED": {
        errorMessage: {
            en: "This email is already used. Please login if you remember password.",
            ua: "Даний email уже використовується. Ви можете ввійти в систему якщо памятаєте пароль.",
        },
        status: 400,
    },
    "CUSTOMER.WRONG_OLD_PASSWORD": {
        errorMessage: {
            en: "Wrong old password.",
            ua: "Не вірний старий пароль.",
        },
        status: 400,
    },
    "CUSTOMER.WRONG_EMAIL_VERIFICATION_CODE": {
        errorMessage: {
            en: 'Wrong email verification code.',
            ua: "Не вірний код веріфікації email.",
        },
        status: 400,
    },
    "CUSTOMER.WRONG_CREDENTIALS": {
        errorMessage: {
            en: "Wrong credentials. Customer doesn't exist.",
            ua: "Не правильні логін чи пароль. Клієн не існує.",
        },
        status: 401,
    },
    "COMPANY.CITY_ID_REQUIRED": {
        errorMessage: {
            en: "Bad request. City id is required",
            ua: "Не правильний запит. City id обовязкове.",
        },
        status: 400,
    },
    "COMPANY.COMPANY_ID_REQUIRED": {
        errorMessage: {
            en: "Bad request. Company id is required",
            ua: "Не правильний запит. Company id обовязкове.",
        },
        status: 400,
    },
    "COMPANY.CUSTOMER_ID_REQUIRED": {
        errorMessage: {
            en: "Bad request. Customer id is required",
            ua: "Не правильний запит. Customer id обовязкове.",
        },
        status: 400,
    },
    "COMPANY.ONLY_OWNER_CAN": {
        errorMessage: {
            en: "Only company owner can edit information.",
            ua: "Тільки власник закладу може змінювати інформацію.",
        },
        status: 400,
    },
    "COMPANY.MAX_COMPANY_AMOUNT": {
        errorMessage: {
            en: "You can create only 1 company. If you need more contact us by email.",
            ua: "Ви можете створити один заклад. Якщо вам потрібно більше напишіть нам на email.",
        },
        status: 400,
    },
    "COMPANY.NO_MENU": {
        errorMessage: {
            en: "Menu wasn't found.",
            ua: "Меню не знайдено.",
        },
        status: 400,
    },
    "COMPANY.DESNT_EXIST": {
        errorMessage: {
            en: "Company wasn't found.",
            ua: "Заклад не знайдено.",
        },
        status: 400,
    },
    "MENU_ITEM.COMPANY_ID_REQUIRED": {
        errorMessage: {
            en: "Bad request. Company id is required",
            ua: "Не правильний запит. Company id обовязкове.",
        },
        status: 400,
    },
    "MENU_ITEM.ONLY_OWNER_CAN": {
        errorMessage: {
            en: "Only owner can bring changes.",
            ua: "Тільки власник може вносити зміни.",
        },
        status: 400,
    },
}


module.exports = {
    resolve,
    throwError,
    resolveError,
    SELECTED_LANGUAGE_ON_FE,
}