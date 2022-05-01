import { Controller } from "./controller.js";
import { ObjectId } from "mongodb";

class AppsController extends Controller {
  constructor() {
    super();
    this.get("/", async (req, res) => {
      let client = this.utils.getClient();
      await client.connect();
      const allApps = await client
        .db("IdeaCollab")
        .collection("Apps")
        .find({})
        .toArray();
      res.send(allApps);
      client.close();
    });

    this.post("/initiate", async (req, res) => {
      let client = this.utils.getClient();
      await client.connect();
      let query = { _id: new ObjectId(req.body._id) };
      let update = { $set: { initiated: true } };

      let result = await client
        .db("IdeaCollab")
        .collection("Apps")
        .updateOne(query, update);
      res.send({
        acknowledged: result.acknowledged,
        modifiedCount: result.modifiedCount,
        result: result,
      });
      client.close();
    });
  }
}

export { AppsController };
