import { Controller } from "./controller.js";

class IndexController extends Controller {
  constructor() {
    super();
    this.get("/", (req, res) => {
      res.sendFile(process.cwd() + "/public/index.html");
    });
  }
}

export { IndexController };
