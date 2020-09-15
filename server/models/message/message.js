const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  message: {
    type: String,
    required: [true, '"message" can not be empty.'],
  },
  created: {
    type: Date,
    required: [true, '"created" is required.'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

module.exports = mongoose.model('message', messageSchema);
