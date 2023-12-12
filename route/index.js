const menuItemEntity = require('./menu_item.route.js');
const customerEntity = require('./customer.route.js');
const companyEntity = require('./company.route.js');
const favoriteCompanyEntity = require('./favorite_company.route.js');
const orderEntity = require('./order.route.js');
const imageEntity = require('./image.route.js');

module.exports = [menuItemEntity, companyEntity, customerEntity, orderEntity, favoriteCompanyEntity, imageEntity];