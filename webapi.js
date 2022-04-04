import express from "express";
import cors from "cors";
import { Utils } from "./utils.js";
import { ObjectId } from "mongodb";

// express restful app
const app = express();
const port = process.env.port || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("GirlCode MongoDB REST API");
});

app.get("/testconnection", async (req, res) => {
  let client = Utils.getClient();
  await client.connect();
  console.log("connection succeeded");
  client.close();
  res.send("connection succeeded");
});

app.get("/apps", async (req, res) => {
  let client = Utils.getClient();
  await client.connect();
  const allApps = await client
    .db("GirlCode")
    .collection("Apps")
    .find({})
    .toArray();
  res.send(allApps);
  client.close();
});

app.post("/features/save", async (req, res) => {
  let client = Utils.getClient();
  await client.connect();

  let query = { _id: new ObjectId(req.body._id) };
  let update = { $push: { features: req.body.feature } };

  let result = await client
    .db("GirlCode")
    .collection("Apps")
    .updateOne(query, update);
  res.send({
    acknowledged: result.acknowledged,
    modifiedCount: result.modifiedCount,
  });
  client.close();
});

app.post("/features/delete", async (req, res) => {
  let client = Utils.getClient();
  await client.connect();

  let query = { _id: new ObjectId(req.body._id) };
  let deleteElement = { $pull: { features: req.body.feature } };

  let result = await client
    .db("GirlCode")
    .collection("Apps")
    .updateOne(query, deleteElement);
  res.send({
    acknowledged: result.acknowledged,
    modifiedCount: result.modifiedCount,
  });
  client.close();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
