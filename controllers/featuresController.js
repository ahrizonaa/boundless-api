import { Controller } from "./controller.js";
import { ObjectId } from "mongodb";

class FeaturesController extends Controller {
  constructor() {
    super();

    this.post("/save", async (req, res) => {
      let client = this.utils.getClient();
      await client.connect();
      console.log(req.body);
      let query = { _id: new ObjectId(req.body._id) };
      let update = { $push: { features: req.body.feature } };

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

    this.post("/delete", async (req, res) => {
      let client = this.utils.getClient();
      await client.connect();

      let query = { _id: new ObjectId(req.body._id) };
      let deleteElement = { $pull: { features: req.body.feature } };

      let result = await client
        .db("IdeaCollab")
        .collection("Apps")
        .updateOne(query, deleteElement);
      res.send({
        acknowledged: result.acknowledged,
        modifiedCount: result.modifiedCount,
      });
      client.close();
    });
  }
}

export { FeaturesController };
