const express = require('express');
const { userIsLoggedIn } = require('../middlewares/auth');

const Message = require('../models/message/message');

const app = express();

app.get('/latest_messages', userIsLoggedIn, async (req, res) => {
  const numberOfMessages = 20;
  try {
    const messages = await Message.find()
      .limit(numberOfMessages)
      .populate('author')
      .exec();
    const total = await Message.countDocuments().exec();
    return res.json({
      ok: true,
      messages,
      total,
    });
  } catch (err) {
    return res.json({
      ok: false,
      err,
    });
  }
});

module.exports = app;
