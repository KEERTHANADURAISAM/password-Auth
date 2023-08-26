const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
// const jwt = require("jwt");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = process.env.DB;
const DB = "MERNAPPCRUD";
const cors = require("cors");

app.use(express.json());
app.use(cors({
  origin: "*"
}))

app.get("/home", (req, res) => {
  res.json({ message: "welcome" });
});

app.post("/register", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const salt = await bcrypt.genSalt(10);
    console.log(salt); //$2a$10$j06pPIoiAuae66tENIJjiu
    let hash = await bcrypt.hash(req.body.password, salt);
    console.log(hash); // random salt + password=$2a$10$j06pPIoiAuae66tENIJjiuov423TknXYlxsazm0VaMqaIOdCUza82
    req.body.password = hash;
    await db.collection("userRegister").insertOne(req.body);
    await connection.close();
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

// login
app.post("/login", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const user = await db
      .collection("userRegister")
      .findOne({ email: req.body.email });
    await connection.close();
    if (user) {
      console.log(req.body.password);
      let compare = await bcrypt.compare(req.body.password, user.password);
      if (compare) {
        res.status(200).json({ message: "login successfully" });
      } else {
        res.status(401).json({ message: "email/username not found" });
      }
    } else {
      res.status(401).json({ message: "email/username not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
});

app.listen(process.env.PORT || 3002);
