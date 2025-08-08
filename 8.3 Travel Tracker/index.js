import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

// Establish Client
const db = new pg.Client({
	user: "postgres",
	host: "localhost",
	database: "world",
	password: "<YOUR_DB_PASSWORD>",
	port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect();

app.get("/", async (req, res) => {
  //Write your code here.
  // Get all country codes
  const countries = await get_countries();
  var total = countries.length;
  res.render("index.ejs", {countries: countries, total: total});
});

app.post("/add", async (req, res) => {
  // Get country code from entry
  const user_country = req.body.country;
  let result;
  try {
    // Get the corresponding country code
    result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'", [user_country.toLowerCase()]);

    if (result.rows.length === 0) {
      const countries = await get_countries();
      var total = countries.length;
      return res.render("index.ejs",{countries: countries, total: total, error: "Country does not exist, try again"})
    }
    // Update visited countries
    await db.query("INSERT INTO visited_countries (country_code) VALUES($1)", [result.rows[0].country_code]);
    res.redirect("/");
  } catch (error) {
    const countries = await get_countries();
    var total = countries.length;
    res.render("index.ejs",{countries: countries, total: total, error: "Country has already been added, try again"})
  }

})

async function get_countries() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach(country => {
    countries.push(country.country_code);
  });
  return countries;
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
