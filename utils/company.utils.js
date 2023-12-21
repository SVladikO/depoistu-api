
function convertCompanyFields(companies) {
    return companies.map(company => {
        const {
            ID: id,
            NAME: name,
            PHONE1: phone1,
            PHONE2: phone2,
            PHONE3: phone3,
            PHOTOS: photos,
            CITY_ID: cityId,
            STREET: street,
            LATITUDE: latitude,
            LONGITUDE: longitude,
            JOIN_DATE: joinDate,
            SCHEDULE: schedule
        } = company;

        return {
            id,
            name,
            phone1,
            phone2,
            phone3,
            photos,
            cityId,
            street,
            latitude,
            longitude,
            joinDate,
            schedule
        }
    })
}


module.exports = {
    convertCompanyFields
}