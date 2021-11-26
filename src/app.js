const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const routerApi = require('./router/router.api');
const routerAdmin = require('./router/router.admin');
const { usuarioGlobal } = require('./middleware/usuarioGlobal');
const db = require('./db/conexion');
dotenv.config({ path: 'variablesDeEntorno.env' });

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const options = {
  host: 'localhost',
  port: 3306,
  user: process.env.USER_BD || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DATABASE || '',
};
const sessionStore = new MySQLStore(options);
app.use(
  session({
    secret: process.env.SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(usuarioGlobal);

//Views engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Settings
app.set('port', process.env.PORT || 3000);

//Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/', express.static(path.join(__dirname, 'public/frontend')));

//Routes
app.use('/admin', routerAdmin);
app.use('/servidor', routerApi);

//Listening
app.listen(app.get('port'), async function () {
  console.log('Servidor en el puerto: ' + app.get('port'));
  try {
    await db.awaitConnect();
    console.log('Base de datos conectada correctamente');
  } catch (error) {
    console.log('Ocurrió un error conectandose a la BD: ' + error.message);
  }
});
