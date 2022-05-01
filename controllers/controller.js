import { Router } from "express";
import { Utils } from "../utils.js";

class Controller extends Router {
  constructor() {
    super();
    this.utils = Utils;
  }

  utils;
}

export { Controller };
