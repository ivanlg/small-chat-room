const userIsLoggedIn = (req, res, next) => {
  const { user } = req.session;
  if (user) {
    next();
  } else {
    res.redirect('/sign_in');
  }
};

const userIsNotLoggedIn = (req, res, next) => {
  const { user } = req.session;
  if (user) {
    res.redirect('/');
  } else {
    next();
  }
};

module.exports = {
  userIsLoggedIn,
  userIsNotLoggedIn,
};
