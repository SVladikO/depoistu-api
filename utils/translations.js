const CURRENT_LANGUAGE = "current-language";

const resolve = (tr, req) => {
    const currentLanguage = req.headers[CURRENT_LANGUAGE];

    console.log(11111, 'TRANSLATION OBJECT: ',  tr)
    console.log(22222, 'SELECTED LANGUAGE: ',currentLanguage)

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
            en: "Verification is failed. Check 'Are you signed in?'.",
            ua: 'Доступ обмежено. Перевірте чи ви залогінились.',
        }
    },
    CUSTOMER: {
        EMAIL_USED: {
            en: "This email is already used. Please login if you remember password.",
            ua: "Даний email уже використовується. Ви можете ввійти в систему якщо памятаєте пароль.",
        },
        WRONG_OLD_PASSWORD: {
            en: "Wrong old password.",
            ua: "Не вірний старий пароль.",
        },
        WRONG_EMAIL_VERIFICATION_CODE: {
            en: 'Wrong email verification code.',
            ua: "Не вірний код веріфікації email.",
        },
        WRONG_CREDENTIALS: {
            en: "Wrong credentials. Customer doesn't exist.",
            ua: "Не правильні логін чи пароль. Клієн не існує.",
        },
    },
    COMPANY: {
        CITY_ID_REQUIRED: {
            en: "Bad request. City id is required",
            ua: "Не правильний запит. City id обовязкове.",
        },
        COMPANY_ID_REQUIRED: {
            en: "Bad request. Company id is required",
            ua: "Не правильний запит. Company id обовязкове.",
        },
        ONLY_OWNER_CAN: {
            en: "Only company owner can edit information.",
            ua: "Тільки власник закладу може змінювати інформацію.",
        },
        NO_MENU: {
            en: "Menu doesn't exist.",
            ua: "Меню відсутнє.",
        },
        DESNT_EXIST: {
            en: "This company doesn't exist.",
            ua: "Даний заклад не існує.",
        }
    },
    MENU_ITEM: {
        COMPANY_ID_REQUIRED: {
            en: "Bad request. Company id is required",
            ua: "Не правильний запит. Company id обовязкове.",
        },
        ONLY_OWNER_CAN: {
            en: "Only owner can bring changes.",
            ua: "Тільки власник може вносити зміни.",
        },
    }
}


module.exports = {
    TRANSLATION,
    resolve
}