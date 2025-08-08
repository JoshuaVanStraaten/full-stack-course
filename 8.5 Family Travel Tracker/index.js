import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "<YOUR_DB_PASSWORD>",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id=$1", [currentUserId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  let users = [];
  users = result.rows;
  return users;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  const users = await getUsers();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal",
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  console.log(currentUserId);

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});
app.post("/user", async (req, res) => {
  if (req.body.user) {
    const user_id = req.body.user;
    currentUserId = parseInt(user_id);

    const result = await db.query(
      "SELECT * FROM users JOIN visited_countries ON users.id = visited_countries.user_id WHERE user_id=$1", [user_id]
    );
    let countries = [];
    var color = "teal";
    if (result.rows.length > 0) {
      color = result.rows[0].color;
      result.rows.forEach((country) => {
        countries.push(country.country_code);
      });
    }
    const users = await getUsers();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: color,
    });
  } else {
    res.render("new.ejs");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const name = req.body.name;
  const color = req.body.color;
  // Add a new user
  const result = await db.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *", [name, color]
    );
  console.log(result.rows);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
