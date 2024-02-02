require('appoptics-apm')
const express = require('express')
const cors = require('cors');

const {connectRoutes, provideApiDocRoute} = require('./utils/api_route_provider.utils')
const {catchHandler} = require('./utils/handler.utils')
const routes = require('./route/index');
const packageJson = require('./package.json')
const {resolveError} = require("./utils/error.utils");
const app = express();

app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use((req, res, next) => {
    if (req.headers['client-version'] !== packageJson.version) {
        catchHandler({res, status: 400})(resolveError('BROKEN_VERSION_CONSISTENCY', req))
    } else {
        next()
    }
});
app.use((err, req, res, next) => {
    if (err) {
        res.status(400).send('error parsing data')
    } else {
        next()
    }
})
app.use(express.static('public'));


connectRoutes(app, routes);
provideApiDocRoute(app, routes);

app.get('/api-list2', function (req, res) {
    res.sendFile(__dirname + '/public/api_list.html');
})

app.get('/db-mode', function (req, res) {
    const {DB_MODE} = process.env;
    res.send({mode: DB_MODE})
})

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => console.log(`app running on port ${PORT}`));
// open('http://localhost:' + PORT)

module.exports = app;

function corsOptionsDelegate(req, callback) {
    const CORS_URL1 = process.env.CORS_URL1;
    const CORS_URL2 = process.env.CORS_URL2;

    const allowlist = [];
    CORS_URL1 && allowlist.push(CORS_URL1)
    CORS_URL2 && allowlist.push(CORS_URL2)

    let corsOptions;

    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {origin: true} // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = {origin: false} // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}
