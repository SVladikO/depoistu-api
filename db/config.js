const { tls } = require('node-tls');

const config = {
         connectionString: 'postgres://bpflvidbquvpdp:a7664b3b120bba81df36a108a98765925157f901cec8f0228f52533004ac96b3@ec2-63-32-248-14.eu-west-1.compute.amazonaws.com:5432/d6j0lksqcelm8h',
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