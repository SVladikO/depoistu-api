const express = require('express')
const cors = require('cors');
const open = require('open'); // open browser after run
const QUERY = require('./db/query')
const dbRequest = require('./utils')
const server = express();
server.use(cors());

server.get('/company/:companyId/menu', function (req, res) {
    const {companyId} = req.params;
    dbRequest(QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID(companyId), value => res.send(value));
})

server.get('/company/:companyId/category', function (req, res) {
    const {companyId} = req.params;
    dbRequest(
        QUERY.MENU_ITEM.SELECT_CATEGORY_ID_BY_COMPANY_ID(companyId),
        value => {
            let result = [...new Set(value.map(v => v.category_id))]
            res.send(result)
        });
})

server.get('/company/:companyId/menu/:categoryId', function (req, res) {
    const {companyId, categoryId} = req.params;

    dbRequest(
        QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID(companyId, categoryId),
        value => res.send(value)
    );
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
open('http://localhost:' + PORT)

module.exports = server;