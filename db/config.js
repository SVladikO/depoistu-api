const { tls } = require('node-tls');

const config = {
         connectionString: 'postgres://ygfgtyshodgjnv:8a42b867639775284cb4ec046e204172f9b921800eb40e6105117e9764987882@ec2-52-48-159-67.eu-west-1.compute.amazonaws.com:5432/d2klbg8sa9s7gl',
         ssl: {
         rejectUnauthorized: false
     }
 };

// Render config;
// {
//    user: 'pizza_mobile_db_state_user',
//    database: 'pizza_mobile_db_state',
//    host: 'dpg-ces09den6mphf4veq0ag-a.frankfurt-postgres.render.com',
//    password: 'SkdNvQAPZPW0lLky2w24W3wXIzaHCoxo',
//    port: 5432,
//    ssl: tls,
//}
module.exports = config;