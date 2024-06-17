import express from "express";

import checkSchema from "../middlewares/checkSchema.middleware.js";

import { googleAuthController } from "../controllers/auth.controller.js";
import { GoogleAuthSchema } from "../schemas/auth.schema.js";

const router = express.Router();

router.post(
  "/google",
  checkSchema({ schema: GoogleAuthSchema }),
  googleAuthController
);

export default router;
