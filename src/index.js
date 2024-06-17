import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import http from "http";

import config from "./config/index.js";
import routes from "./routes/index.js";
import responseMiddleware from "./middlewares/response.middleware.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import corsMiddleware from "./middlewares/cors.middleware.js";
import initializeSocket from "./socket/socket.js";

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// parse formData
app.use(upload.single("image"));

// for success and error response
app.use(responseMiddleware);

// cors protection
app.use(corsMiddleware);

// implement routes
app.use(config.API_PREFIX + "/v1", routes);

// error handling
app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Singa Chat" });
});

app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});

// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

mongoose.connect(config.MONGO_URL).then(() => {
  console.log("DB connected");
  server.listen(config.PORT, () => {
    console.log(`Server running at port - ${config.PORT}`);
  });
});

export default app;
