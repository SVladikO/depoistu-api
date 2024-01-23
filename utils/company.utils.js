
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
            SCHEDULE: schedule,
            IS_VERIFIED: is_verified
        } = company;

        return {
            id,
            name,
            phone1,
            phone2,
            phone3,
            photos: photos?.length ? photos.split(',') : [],
            cityId,
            street,
            latitude,
            longitude,
            joinDate,
            schedule,
            is_verified: !!is_verified
        }
    })
}


module.exports = {
    convertCompanyFields
}