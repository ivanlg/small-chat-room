require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const initializeConnection = require('./sockets/initialize_connection');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Use the session middleware
const sessionMiddleware = session({ secret: 'secret', cookie: { maxAge: 60 * 60 * 1000 } });
// set up socket.io
initializeConnection(http, sessionMiddleware);

app.use(sessionMiddleware);
// global routes
app.use(require('./routes/index'));

app.set('view engine', 'hbs');

const helpers = require('../views/helpers/helpers');

app.engine('hbs', handlebars({
  layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
  partialsDir: path.join(__dirname, '..', 'views', 'partials'),
  extname: 'hbs',
  defaultLayout: 'main',
  helpers,
}));

app.use(express.static('public'));

mongoose.connect(
  process.env.DBURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log("We're connected!");
  http.listen(process.env.PORT, () => {
    console.log('Listening on port: ', process.env.PORT);
  });
});
