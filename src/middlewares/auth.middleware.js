import { UnauthenticatedError } from "../helper/custom-errors.js";
import { decode } from "../libs/jwt.js";

import { findUserService } from "../services/user.service.js";

export default async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      return next(new UnauthenticatedError());
    }

    const [type, token] = authorization.split(" ");

    if (type != "Bearer") {
      return next(new UnauthenticatedError());
    }

    const payload = await decode(token);

    const user = await findUserService(payload.id);

    if (!user) next(new UnauthenticatedError());

    req.user = user;

    return next();
  } catch (err) {
    console.log("error => ", err);
    return next(new UnauthenticatedError("Token expired"));
  }
};
