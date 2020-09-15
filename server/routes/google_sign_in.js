require('../config/config');
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user/user');
const roles = require('../models/user/constants');

const client = new OAuth2Client(process.env.CLIENT_ID);
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

const app = express();

app.get('/google_sign_in/:token', async (req, res) => {
  const { token } = req.params;
  const errorMessages = [];
  let userDB;
  let payload;

  try {
    payload = await verify(token);
  } catch (err) {
    errorMessages.push('Invalid token.');
    res.render('sign_in', { error: true, errorMessages });
    return;
  }

  try {
    userDB = await User.findOne({ email: payload.email }).exec();
    if (!userDB) {
      const user = new User({
        name: payload.name,
        email: payload.email,
        password: 'NO PASSWORD',
        role: roles.USER,
        google: true,
      });
      userDB = await user.save();
    }
  } catch (err) {
    errorMessages.push('Internal error.');
    res.render('sign_in', { error: true, errorMessages });
    return;
  }

  req.session.user = userDB.toJSON();
  req.session.user.signedInWithGoogle = true;
  res.redirect('/');
});

module.exports = app;
