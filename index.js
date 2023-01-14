const express = require('express')
const cors = require('cors');
const open = require('open'); // open browser after run
const QUERY = require('./db/query')
const {dbRequest, getParamMessageRequirements, logRequestDetails} = require('./utils')
const server = express();
server.use(cors());

server.get('/company/:companyId/menu', function (req, res) {
    logRequestDetails(req)

    const {companyId} = req.params;

    if (isNaN(companyId)) {
        res.send(getParamMessageRequirements('companyId',));
        return;
    }

    dbRequest(QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID(companyId), dbResponce => res.send(dbResponce));
})

server.get('/insert', function (req, res) {
    dbRequest(QUERY.MENU_ITEM.INSERT)
});

server.get('/company/:companyId/category', function (req, res) {
    logRequestDetails(req)
    const {companyId} = req.params;

    if (isNaN(companyId)) {
        res.send(getParamMessageRequirements('companyId'))
        return;
    }

    dbRequest(
        QUERY.MENU_ITEM.SELECT_CATEGORY_ID_BY_COMPANY_ID(companyId),
        dbResponce => {
            let result = [...new Set(dbResponce.map(v => v.category_id))]
            res.send(result)
        },
        dbResponce => res.send(dbResponce)
    );
})

const URL = {
    MENU_ITEM: '/company/:companyId/menu_item/:categoryId',
}

server.get(URL.MENU_ITEM, function (req, res) {
    logRequestDetails(req)
    const {companyId, categoryId} = req.params;

    if (isNaN(companyId)) {
        res.send(getParamMessageRequirements('companyId'))
        return;
    }

    if (isNaN(categoryId)) {
        res.send(getParamMessageRequirements('categoryId'))
        return;
    }

    dbRequest(
        QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID(companyId, categoryId),
        dbResponce => res.send(dbResponce),
        dbResponce => res.send(dbResponce)
    );
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
open('http://localhost:' + PORT)

module.exports = server;