import { Controller } from "./controller.js";
import { ObjectId } from "mongodb";

class AuthController extends Controller {
  constructor(c, d) {
    super(c, d);

    this.post("/user", async (req, res) => {
      let result = await this.db
        .collection("Users")
        .findOne({ _id: new ObjectId(req.body._id) });

      res.send(result);
    });

    this.post("/exists", async (req, res) => {
      let search = await this.db
        .collection("Users")
        .findOne({ tel: req.body.tel });
      res.send(search);
    });

    this.post("/validated", async (req, res) => {
      let query = { _id: ObjectId(req.body._id) };
      let update = { $set: { validatedon: req.body.validatedon } };

      let result = await this.db.collection("Users").updateOne(query, update);

      res.send(result);
    });

    this.post("/requestcode", async (req, res) => {
      let code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      await this.twilio.messages
        .create({
          body: code,
          to: req.body.tel,
          from: process.env.TWILIO_PHONE_NUMBER,
        })
        .then((msg) => {
          msg.code = code;
          res.send(msg);
        });
    });

    this.post("/createaccount", async (req, res) => {
      let result = await this.db.collection("Users").insertOne({
        tel: req.body.tel,
        displayname: req.body.displayname,
        validatedon: req.body.validatedon,
        settings: req.body.settings,
      });

      res.send(result);
    });
  }
}

export { AuthController };
