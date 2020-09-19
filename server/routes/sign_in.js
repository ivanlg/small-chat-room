const express = require('express');
const bcrypt = require('bcrypt');
const { userIsNotLoggedIn } = require('../middlewares/auth');

const User = require('../models/user/user');

const app = express();

app.get('/sign_in', userIsNotLoggedIn, (req, res) => {
  res.render('sign_in', { error: false, errorMessages: [] });
});

app.post('/sign_in', async (req, res) => {
  const { body } = req;
  const errorMessages = [];
  User.findOne({ email: body.email }, (err, userDB) => {
    if (err) {
      errorMessages.push('Internal server Error.');
      res.render('sign_in', { error: true, errorMessages });
      return;
    }

    if (!userDB) {
      errorMessages.push('Invalid email or password');
      res.render('sign_in', { error: true, errorMessages });
      return;
    }

    if (userDB.google) {
      errorMessages.push('You have to use the google sign in.');
      res.render('sign_in', { error: true, errorMessages });
      return;
    }

    if (!bcrypt.compareSync(body.password, userDB.password)) {
      errorMessages.push('Invalid email or password');
      res.render('sign_in', { error: true, errorMessages });
      return;
    }

    req.session.user = userDB;
    res.redirect('/');
  });
});

module.exports = app;
