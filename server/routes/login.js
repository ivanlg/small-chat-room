const express = require('express');
const bcrypt = require('bcrypt');

const { getErrorResponse } = require('../utils/utils');
const User = require('../models/user/user');

const app = express();

app.post('/login', (req, res) => {
  const { body } = req;
  User.findOne({ email: body.email }, (err, userDB) => {
    if (err) {
      return getErrorResponse(err, res, 500);
    }

    if (userDB.google) {
      const err = {
        message: 'You have to use the google sign in.',
      };
      return getErrorResponse(err, res, 500);
    }

    if (!userDB) {
      const err = {
        message: 'Invalid email or password',
      };
      return getErrorResponse(err, res, 400);
    }

    if (!bcrypt.compareSync(body.password, userDB.password)) {
      const err = {
        message: 'Invalid email or password',
      };
      return getErrorResponse(err, res, 400);
    }

    req.session.user = userDB;
    res.json({
      ok: true,
      user: userDB,
    });
  });
});

module.exports = app;
