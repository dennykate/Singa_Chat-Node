import express from "express";
import { findAllUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", findAllUser);

export default router;
