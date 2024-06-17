import tryCatch from "../helper/try-catch.js";
import { googleAuthService } from "../services/auth.service.js";

export const googleAuthController = tryCatch(async (req, res) => {
  const result = await googleAuthService(req);

  return res.success(result);
});
