const mongoose = require('mongoose');
const _ = require('underscore');
const uniqueValidator = require('mongoose-unique-validator');
const { roles } = require('./constants');

const validRoles = {
  values: _.values(roles),
  message: '{VALUE} is not a valid role.',
};
const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, '"Name" is required.'],
  },
  email: {
    type: String,
    required: [true, '"Email" is required.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, '"Password" is required.'],
  },
  img: {
    type: String,
    default: '/assets/img/default_avatar.png',
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: validRoles,
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

// hide password property
userSchema.methods.toJSON = function () {
  const user = this;
  const { signedInWithGoogle } = user;
  const userObject = user.toObject();
  delete userObject.password;
  userObject.signedInWithGoogle = signedInWithGoogle;

  return userObject;
};

userSchema.plugin(uniqueValidator, { message: '"{VALUE}" is already in use.' });

module.exports = mongoose.model('user', userSchema);
