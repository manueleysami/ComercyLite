const mysqlAwait = require('mysql-await');
require('dotenv').config({ path: 'variablesDeEntorno.env' });
const conexion = mysqlAwait.createConnection({
  connectionLimit: 10,
  host: 'localhost',
  user: process.env.USER_BD || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DATABASE || '',
});

module.exports = conexion;
