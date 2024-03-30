// 60

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const connection = require("./config");
const users = require("./model");

const indexPath = path.join(__dirname, "..", "spotify", "index.html");

const app = express();

connection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login", {err_msg : null, reg_msg : null});
});

app.get("/usersData", async (req, res) => {
  const document = await users.find({});
  res.json(document);
});

app.get("/signup", (req, res) => {
  res.render("signup", {err_msg : null});
});

//  signup :

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.uname,
    password: req.body.upassword,
  };

  const existngUser = await users.findOne({ name: data.name });
  if (existngUser) {
    res.render("signup", { err_msg : " User already exists ... !" });
  } else {
    // password encoding :
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;
    const userdata = await users.insertMany(data);
    console.log("\ndata : \n" + userdata);
    res.render("login", {err_msg : null, reg_msg : "registered successfully...! "});
  }
});
//  login :

app.post("/login", async (req, res) => {
  try {
    const data = {
      name: req.body.uname,
      password: req.body.upassword,
    };
    const check = await users.findOne({ name: data.name });
    if (!check) {
      res.render("login", { err_msg : "User not found !" });
    } else {
      const isPasswordMatch = await bcrypt.compare(
        data.password,
        check.password
      );

      if (isPasswordMatch) {
        res.sendFile(indexPath);
      } else {
        res.render("login", { err_msg : "Incorrect Password.... !" });
      }
    }
  } catch {
    res.send("wrong data");
  }
});

app.listen(5000, () => {
  console.log("server is running ....");
});
