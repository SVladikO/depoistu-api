const express = require('express')
const cors = require('cors');
const dbConfig = require('./db/config')
const QUERY = require('./db/query')
const {Pool} = require('pg');
const dbRequest = require('./utils')

const server = express()

server.use(cors());

const pool = new Pool({
                        connectionString: 'postgres://bpflvidbquvpdp:a7664b3b120bba81df36a108a98765925157f901cec8f0228f52533004ac96b3@ec2-63-32-248-14.eu-west-1.compute.amazonaws.com:5432/d6j0lksqcelm8h',
                        ssl: {
                          rejectUnauthorized: false
                        }
                      });

server.get('/company/:companyId/menu', function (req, res) {
    const {companyId} = req.params;
    dbRequest(pool, QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID(companyId), value => res.send(value));
})

server.get('/company/:companyId/category', function (req, res) {
    const {companyId} = req.params;
    dbRequest(
        pool,
        QUERY.MENU_ITEM.SELECT_CATEGORY_ID_BY_COMPANY_ID(companyId),
        value => {

            let result = [...new Set(value.map(v => v.category_id))]
            res.send(result)
        });
})

server.get('/company/:companyId/menu/:categoryId', function (req, res) {
    const {companyId, categoryId} = req.params;

    dbRequest(
        pool,
        QUERY.MENU_ITEM.SELECT_ALL_BY_COMPANY_ID_AND_BY_CATEGORY_ID(companyId, categoryId),
        value => res.send(value)
    );
})


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;