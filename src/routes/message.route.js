import express from "express";

import { findAllMessageController } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/", findAllMessageController);

export default router;
