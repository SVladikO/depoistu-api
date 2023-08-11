const express = require('express')
const cors = require('cors');
// const open = require('open'); // open browser after run

const {connectRoutes, provideBEApi, logRequestDetails, DB_MODE} = require('./utils')
const routes = require('./route/index');

const app = express();


app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.static('public'));
app.use(logRequestDetails);

connectRoutes(app, routes);
provideBEApi(app, routes);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/db-mode', function (req, res) {
    res.send({mode: DB_MODE})
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`app running on port ${PORT}`));
// open('http://localhost:' + PORT)

module.exports = app;

function corsOptionsDelegate(req, callback) {
    const allowlist = [
        'https://depoistu-qa.onrender.com',
        'https://depoistu-develop.onrender.com',
        'https://depoistu-stage.onrender.com',
        'https://depoistu.com',
        'http://localhost:3000'
    ];

    let corsOptions;

    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}
