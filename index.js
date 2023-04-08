const express = require('express')
const cors = require('cors');
const open = require('open'); // open browser after run

const {connectRoutes, provideBEApi, logRequestDetails} = require('./utils')
const routes = require('./route/index');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(logRequestDetails);

connectRoutes(app, routes);
provideBEApi(app, routes);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`app running on port ${PORT}`));
open('http://localhost:' + PORT)

module.exports = app;