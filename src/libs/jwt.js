import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { UnauthenticatedError } from "../helper/custom-errors.js";

export const generate = (data, type) => {
  const expiresIn =
    type === "access"
      ? config.access_token_expiry
      : config.refresh_token_expiry;

  return jwt.sign(data, config.secret_key, { expiresIn });
};

export const decode = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret_key, (err, payload) => {
      if (err) throw new UnauthenticatedError("Token expired");

      resolve(payload);
    });
  });
};
