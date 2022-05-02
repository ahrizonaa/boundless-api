import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import expressJWT from "express-jwt";
import { config } from "dotenv";

import { IndexController } from "./controllers/indexController.js";
import { AppsController } from "./controllers/appsController.js";
import { FeaturesController } from "./controllers/featuresController.js";
import { AuthController } from "./controllers/authController.js";

config();

// express restful app
const app = express();
const port = process.env.port || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", new IndexController());
app.use("/apps", new AppsController());
app.use("/features", new FeaturesController());
app.use("/auth", new AuthController());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
