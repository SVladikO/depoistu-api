const express = require('express')
const cors = require('cors');
const open = require('open'); // open browser after run

const singInUp = require('./route/sing_in_up.js');
const company = require('./route/company.js');
const order = require('./route/order.js');
const menu = require('./route/menu.js');
const dev = require('./route/dev.js');

const app = express();

app.use(cors());
app.use(express.json());

singInUp(app);
company(app);
order(app);
menu(app);
dev(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`app running on port ${PORT}`));
open('http://localhost:' + PORT)

module.exports = app;