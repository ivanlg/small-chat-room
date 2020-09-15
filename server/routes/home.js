const express = require('express');
const { userIsLoggedIn } = require('../middlewares/auth');

const app = express();

app.get('/', userIsLoggedIn, async (req, res) => {
  const { user } = req.session;
  res.render('home', {
    loggedUser: user,
  });
});

module.exports = app;
