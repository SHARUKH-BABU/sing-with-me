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
  res.render("login");
});

app.get("/usersData", async (req, res) => {
  const document = await users.find({});
  res.json(document);
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

//  signup :

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.uname,
    password: req.body.upassword,
  };

  const existngUser = await users.findOne({ name: data.name });
  if (existngUser) {
    res.send("user-id already exists...!");
  } else {
    // password encoding :
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;
    const userdata = await users.insertMany(data);
    console.log("\ndata : \n" + userdata);
    res.render("login");
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
      res.send("no user-id found....");
    } else {
      const isPasswordMatch = await bcrypt.compare(
        data.password,
        check.password
      );

      if (isPasswordMatch) {
        res.sendFile(indexPath);
      } else {
        res.send("incorrect password");
      }
    }
  } catch {
    res.send("wrong data");
  }
});

app.listen(5000, () => {
  console.log("server is running ....");
});
