import { Controller } from "./controller.js";

class AuthController extends Controller {
  constructor(c, d) {
    super(c, d);

    this.post("/exists", async (req, res) => {
      let search = await this.db
        .collection("Users")
        .findOne({ tel: req.body.tel });
      res.send(search);
    });

    this.post("/requestcode", async (req, res) => {
      let code = Math.floor(Math.random() * 999999);
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
      });

      res.send(result);
    });
  }
}

export { AuthController };
