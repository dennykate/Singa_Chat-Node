import { findAllUserService } from "../services/user.service.js";

export const findAllUser = async (req, res) => {
  const users = await findAllUserService(req);

  return res.success(users);
};
