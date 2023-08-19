const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = process.env.DB;
const DB = "MERNAPPCRUD";

app.use(express.json());

app.get("/home", (req, res) => {
  res.json({ message: "welcome" });
});

app.post("/register", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const user = await db.collection("userRegister").insertOne(req.body);
    await connection.close();
    res.status(200).json({ message: "register successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "can't connect database" });
  }
});

app.put("/register/:id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const user = await db
      .collection("userRegister")
      .findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );
    await connection.close();
    res.status(200).json({ message: "Done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "can't connect database" });
  }
});

app.get("/register/:id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const user = await db
      .collection("userRegister")
      .findOne({ _id: new mongodb.ObjectId(req.params.id) });
    await connection.close();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "can't connect database" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const user = await db.collection("userRegister").find().toArray();
    await connection.close();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "can't connect database" });
  }
});

app.delete("/register/:id", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const user = await db
      .collection("userRegister")
      .findOneAndDelete({ _id: new mongodb.ObjectId(req.params.id) });
    await connection.close();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "can't connect database" });
  }
});

app.listen(process.env.PORT || 3002);
