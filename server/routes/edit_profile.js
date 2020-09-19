/* eslint-disable no-underscore-dangle */
const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const aws = require('aws-sdk');

const { userIsLoggedIn } = require('../middlewares/auth');

const User = require('../models/user/user');

const app = express();

const { S3_BUCKET } = process.env;
aws.config.region = 'us-east-1';

app.get('/sign-s3', userIsLoggedIn, (req, res) => {
  const { user } = req.session;
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const realFilename = `${user._id}_profile_pic_${fileName}`;
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: realFilename,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${encodeURIComponent(realFilename)}`,
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

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
  const values = _.pick(body, ['name', 'profilePicUrl']);
  const id = loggedUser._id;
  try {
    const user = await User.findById(id)
      .exec();

    if (user) {
      // if (!bcrypt.compareSync(values.password, user.password)) {
      //   res.render('edit_profile', {
      //     success: false,
      //     error: true,
      //     errorMessages: ['Invalid password.'],
      //     loggedUser,
      //   });
      //   return;
      // }
      // user.password = bcrypt.hashSync(values.newPassword, 10);
      user.name = values.name;
      user.img = values.profilePicUrl;
      const userDb = await user.save();
      req.session.user = userDb;
      res.render('edit_profile', {
        success: true,
        error: false,
        errorMessages: [],
        loggedUser: userDb,
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
