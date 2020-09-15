const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { userIsNotLoggedIn } = require('../middlewares/auth');

const User = require('../models/user/user');

const app = express();

app.get('/sign_up', userIsNotLoggedIn, (req, res) => {
  res.render('sign_up', { error: false, errorMessages: [] });
});

app.post('/sign_up', async (req, res) => {
  const { body } = req;
  const user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
  });
  try {
    const userDB = await user.save();
    req.session.user = userDB.toJSON();
    res.redirect('/');
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const errArray = Object.entries(err.errors);
      const errorMessages = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const [, validatorError] of errArray) {
        if (validatorError instanceof mongoose.Error.ValidatorError) {
          errorMessages.push(validatorError.message);
        }
      }
      res.render('sign_up', { error: true, errorMessages });
    } else {
      res.render('sign_up', { error: true, errorMessages: ['Unknown error.'] });
    }
  }
});

module.exports = app;
