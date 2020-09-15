const getErrorResponse = (err, res, code) => res.status(code).json({
  ok: false,
  err,
});

module.exports = {
  getErrorResponse,
};
