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

    this.post("/add", async (req, res) => {
      let client = this.utils.getClient();
      await client.connect();

      let result = await client.db("IdeaCollab").collection("Apps").insertOne({
        name: req.body.name,
        originator: req.body.originator,
        features: req.body.features,
        timeline: req.body.timeline,
      });
      res.send(result);
      client.close();
    });

    this.delete("/delete", async (req, res) => {
      let client = this.utils.getClient();
      await client.connect();

      let query = { _id: new ObjectId(req.body._id) };

      let deletedCount = (
        await client.db("IdeaCollab").collection("Apps").deleteOne(query)
      ).deletedCount;

      let apps = await client
        .db("IdeaCollab")
        .collection("Apps")
        .find({})
        .toArray();
      res.send({ deletedCount, apps });
      client.close();
    });
  }
}

export { AppsController };
