const express = require('express');

const app = express();

app.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/google_log_out', async (req, res) => {
  req.session.destroy();
  res.render('google_log_out', {});
});

module.exports = app;
