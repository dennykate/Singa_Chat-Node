import express from "express";

import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import messageRoutes from "./message.route.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const api = express.Router();

api.use("/auth", authRoutes);
api.use("/messages", authMiddleware, messageRoutes);
api.use("/users", authMiddleware, userRoutes);

export default api;
