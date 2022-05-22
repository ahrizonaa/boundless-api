const server = express();

import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import expressJWT from "express-jwt";
import { client, db } from "../lib/client.js";

import {
  IndexController,
  AppsController,
  FeaturesController,
  AuthController,
  SettingsController,
  TimelineController,
} from "../controllers/index.js";

server.set("json spaces", 4);
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));

server.use("/", new IndexController(client, db));
server.use("/servers", new AppsController(client, db));
server.use("/features", new FeaturesController(client, db));
server.use("/auth", new AuthController(client, db));
server.use("/settings", new SettingsController(client, db));
server.use("/timeline", new TimelineController(client, db));

export { server };
