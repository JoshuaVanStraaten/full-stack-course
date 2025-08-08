import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Set Up a new PG client
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "secrets",
    password: "@1p4Aman",
    port: 5432,
});

// Connect to the DB
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  // Get Username and password
  const email = req.body.username;
  const password = req.body.password;

  try {
    // Check whether email is already registerd
    const checkResult = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    // Add email and password to DB
    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      try {
        await db.query("INSERT INTO users (email, password) " +
          "VALUES ($1, $2)", [email, password]
        );
        res.render("secrets.ejs");
      } catch (err) {
        console.log(err);
        res.status(500).send("Unable to register user");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  // Get Username and password
  const email = req.body.username;
  const password = req.body.password;

  try {
    // Check whether email is registerd
    const checkResult = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    // Add email and password to DB
    if (checkResult.rows.length > 0) {
      try {
        const result = await db.query("SELECT password FROM users WHERE email=$1 ", [email]);
        const realPassword = result.rows[0].password;
        if (realPassword !== password) {
          res.send("Password is incorrect. Please try again ...");
        } else {
          res.render("secrets.ejs");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Unable to Log user in");
      }
    } else {
      res.send("Email not found. Please register an account.");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
