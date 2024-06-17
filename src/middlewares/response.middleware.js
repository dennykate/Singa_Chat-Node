export default (req, res, next) => {
  res.success = (data, statusCode = 200, extended = {}) => {
    res.status(statusCode).json({ success: true, data, ...extended });
  };

  res.error = (message, statusCode = 400) => {
    res.status(statusCode).json({ success: false, message });
  };

  return next();
};
