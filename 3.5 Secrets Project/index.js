//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
var showSecret = false;

// Configure Middleware
app.use(bodyParser.urlencoded({ extended: true }));

function checkPassword(req, res, next) {
  console.log(req.body);
  // Check password
  if (req.body.password === "ILoveProgramming") {
    showSecret = true;
  } else {
    showSecret = false;
  }
  next();
}

app.use(checkPassword);

// Handle Endpoints
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) => {
    // Check if password is correct
    console.log(`showSecret: ${showSecret}`);
    if (showSecret) {
        res.sendFile(__dirname + "/public/secret.html");
    } else {
        res.sendFile(__dirname + "/public/index.html");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
