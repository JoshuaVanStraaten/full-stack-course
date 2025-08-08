import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

// Set up a new PG client
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "<YOUR_DB_PASSWORD>",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

async function getItems() {
  const result = await db.query("SELECT * FROM items");
  items = result.rows;
  return items;
}

app.get("/", async (req, res) => {
  const items = await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // Add a new item
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  // Update Entry
  try {
    await db.query("UPDATE items SET title=$1 WHERE id=$2", [title, id]);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  // Remove Entry
  try {
    await db.query("DELETE FROM items WHERE id=$1", [id]);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
