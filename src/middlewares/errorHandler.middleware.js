export default (err, req, res, next) => {
  console.error(err);

  const message = err.statusCode ? err.message : "Internal server error";

  const statusCode = err.statusCode ?? 500;

  return res.error(message, statusCode);
};
