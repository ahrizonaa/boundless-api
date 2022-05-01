import { Controller } from "./controller.js";

class IndexController extends Controller {
  constructor() {
    super();
    this.get("/", (req, res) => {
      res.send("<h1>GirlCode MongoDB Rest Api</h1>");
    });
  }
}

export { IndexController };
