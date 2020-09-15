const express = require('express');

const app = express();
app.use(require('./home'));
app.use(require('./login'));
app.use(require('./logout'));
app.use(require('./sign_up'));
app.use(require('./sign_in'));
app.use(require('./edit_profile'));
app.use(require('./message'));
app.use(require('./google_sign_in'));

module.exports = app;
