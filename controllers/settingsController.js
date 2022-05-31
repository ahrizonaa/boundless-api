import { Controller } from "./controller.js";
import { ObjectId } from "mongodb";

export class SettingsController extends Controller {
  constructor(c, d) {
    super(c, d);

    this.post("/save", async (req, res) => {
      let collection = this.db.collection("Users");

      let settings = Object.keys(req.body.settings);

      let response = {
        modifiedCount: 0,
      };

      for (let i = 0; i < settings.length; i++) {
        let query = { _id: new ObjectId(req.body.user._id) };
        let property = `settings.${settings[i]}`;
        let updateVal = {};
        updateVal[property] = req.body.settings[settings[i]];

        let update = { $set: updateVal };
        let result = await collection.updateOne(query, update);
        response.modifiedCount += result.modifiedCount;
      }

      res.send(response);
    });

    this.post("/backgrounds", async (req, res) => {
      //
    });
  }
}
