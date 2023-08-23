const CURRENT_LANGUAGE = "current-language";

const resolve = (tr, req) => {
    const currentLanguage = req.headers[CURRENT_LANGUAGE];

    if (!currentLanguage) {
        return tr['en']
    }

    return tr[currentLanguage];
}
const TRANSLATION = {
    TOKEN: {
        REQUIRED: {
            en: "A token is required. Check 'Are you signed in?'.",
            ua: "Для даної операції потрібен токен. Перевірте чи ви залогінились."
        },
        INVALID: {
            en: "Invalid Token. Check 'Are you signed in?'.",
            ua: "Пошкоджений токен. Перевірте чи ви залогінились."
        },
        FAKE: {
            en: "Customer does not exist. Verification is failed. Check 'Are you signed in?'.",
            ua: 'Користувач не існує. Доступ обмежено. Перевірте чи ви залогінились.',
        }
    },
    CUSTOMER: {
        EMAIL_USED: {
            en: "This email is already used. Please login.",
            ua: "Даний email уже використовується. Залогіньтесь.",
        },
        WRONG_PASSWORD: {
            en: "This email is already used. Please login.",
            ua: "Даний email уже використовується. Залогіньтесь.",
        },
        WRONG_EMAIL_VERIFICATION_CODE: {
            en: 'Wrong email verification code.',
            ua: "Не вірний код веріфікації email.",
        },
    },
    COMPANY: {
        RESTRICTION_UPDATE: {
            en: "Only company owners can change data.",
            ua: "Лише власник компанії може змінювати дані.",
        },
        RESTRICTION_DELETE: {
            en: "Only owner can delete company.",
            ua: "Лише власник може видаляти компанію.",
        },
        CITY_ID_REQUIRED: {
            en: "Bad request. City id is required",
            ua: "Не правильний запит. City id обовязкове.",
        },
        COMPANY_ID_REQUIRED: {
            en: "Bad request. Company id is required",
            ua: "Не правильний запит. Company id обовязкове.",
        },
    },
    MENU_ITEM: {
        COMPANY_ID_REQUIRED: {
            en: "Bad request. Company id is required",
            ua: "Не правильний запит. Company id обовязкове.",
        },

    }
}


module.exports = {
    TRANSLATION,
    resolve
}