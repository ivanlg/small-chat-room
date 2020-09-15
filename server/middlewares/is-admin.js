const { getErrorResponse } = require('../utils/utils');
const { roles } = require('../models/user/constants');
const User = require('../models/user/user');

const isAdmin = (req, res, next) => {
  const { user } = req.session;
  const userId = user._id;
  User.findById(userId, (err, userDB) => {
    if (userDB.role === roles.ADMIN) {
      next();
    } else {
      const error = {
        message: 'Permission denied.',
      };
      getErrorResponse(error, res, 401);
    }
  });
};

module.exports = {
  isAdmin,
};
