const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const URL = "mongodb://root:root@mongodb:27017/?authSource=admin";
const client = new MongoClient(URL, {
  useUnifiedTopology: true,
});

let pets;

async function initDB() {
  try {
    dbInstance = await client.connect();
    await client.db("adoption").command({ ping: 1 });
    console.log("\n===================\n");
    console.log("Express connected to mongodb");
    console.log("\n===================\n");
    pets = dbInstance.db("adoption").collection("pets");

    pets.createIndex({
      type: "text",
      name: "text",
      breed: "text",
    });

    const app = express();

    app.use(cors());
    app.route("/dogs").get(async (req, res) => {
      const dogs = await pets.find({ type: "dog" }).toArray();
      console.log(dogs);
      res.json(dogs);
    });

    app.listen(4000, () => {
      console.log("Express server listening on port 4000");
    });
  } catch (error) {
    console.log("\n\nError while connecting to mongodb instance");
    console.log(error);
    throw error;
  }
}
initDB();
