const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = process.env.DB;
const DB = "MERNAPPCRUD";
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

let authendicate = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let decode = jwt.verify(req.headers.authorization, process.env.SECRET);
      if (decode) {
        next();
      }
    } catch {
      res.status(401).json({ message: "UNATHORIZED" });
    }
  } else {
    res.status(401).json({ message: "UNATHORIZED" });
  }
};

app.post("/register", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const salt = await bcrypt.genSalt(10);
    // console.log(salt); //$2a$10$j06pPIoiAuae66tENIJjiu
    let hash = await bcrypt.hash(req.body.password, salt);
    // console.log(hash); // random salt + password=$2a$10$j06pPIoiAuae66tENIJjiuov423TknXYlxsazm0VaMqaIOdCUza82
    req.body.password = hash;
    await db.collection("userRegister").insertOne(req.body);
    await connection.close();
    res.json({ message: "register successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

app.get("/users", authendicate, async (req, res) => {
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

    if (user) {
      let compare = await bcrypt.compare(req.body.password, user.password);

      if (compare) {
        let token = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "2m",
        });
        res.json({ token });
      } else {
        res.status(401).json({ message: "email/username not found" });
      }
    } else {
      res.status(401).json({ message: "email/username not found" });
    }
    await connection.close();
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
});

app.post("/products", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const user = await db.collection("products").insertOne(req.body);
    await connection.close();
    res.json("products inserted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "can't connect database" });
  }
});

app.get("/getproducts", authendicate, async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);
    const user = await db.collection("products").find().toArray();
    await connection.close();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "can't connect database" });
  }
});

app.listen(process.env.PORT || 3002);
