import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Use Pre-Processing Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set up Endpoints
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.post("/submit", (req, res) => {
  res.send(
    `<h1>Your band name is:</h1>
      <p><strong>${req.body.street}${req.body.pet}</strong></p>`
  );
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
