const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
// const jwt = require("jwt");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = process.env.DB;
const DB = "MERNAPPCRUD";

app.use(express.json());

app.get("/home", (req, res) => {
  res.json({ message: "welcome" });
});

app.post("/register", async function (req, res) {
  try {
    const connection = await mongodb.connect(URL);
    const db = connection.db(DB);
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    let hash = await bcrypt.hash(req.body.password, salt);
    console.log(hash);
    await db.collection("userRegister").insertOne(req.body);
    connection.close();
    res.json({ message: "register successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
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

app.listen(process.env.PORT || 3002);
