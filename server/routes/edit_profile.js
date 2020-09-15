/* eslint-disable no-underscore-dangle */
const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');

const { userIsLoggedIn } = require('../middlewares/auth');

const User = require('../models/user/user');

const app = express();

app.get('/edit_profile', userIsLoggedIn, (req, res) => {
  const { user } = req.session;
  res.render('edit_profile', {
    success: false,
    error: false,
    errorMessages: [],
    loggedUser: user,
  });
});

app.post('/edit_profile', userIsLoggedIn, async (req, res) => {
  const { body } = req;
  const loggedUser = req.session.user;
  const values = _.pick(body, ['name', 'password', 'newPassword']);
  const id = loggedUser._id;
  try {
    const user = await User.findById(id)
      .exec();

    if (user) {
      if (!bcrypt.compareSync(values.password, user.password)) {
        res.render('edit_profile', {
          success: false,
          error: true,
          errorMessages: ['Invalid password.'],
          loggedUser,
        });
        return;
      }
      user.password = bcrypt.hashSync(values.newPassword, 10);
      user.name = values.name;
      const userDb = await user.save();
      req.session.user = userDb.toJSON();
      res.render('edit_profile', {
        success: true,
        error: false,
        errorMessages: [],
        loggedUser,
      });
    } else {
      res.render('edit_profile', {
        success: false,
        error: true,
        errorMessages: ['The user does not exists.'],
        loggedUser,
      });
    }
  } catch (err) {
    res.render('edit_profile', {
      success: false,
      error: true,
      errorMessages: ['Internal error, try again later.'],
      loggedUser,
    });
  }
});

module.exports = app;
