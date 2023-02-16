const {dbRequest} = require("../utils");
const QUERY = require("../db/query");

module.exports = function (app) {
    app.get('/insert', function (req, res) {
        dbRequest(QUERY.INSERT, dbRes => res.send(dbRes), dbRes => res.send(dbRes))
    });
}