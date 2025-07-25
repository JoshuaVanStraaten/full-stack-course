import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const today = new Date();  // New date object of current date and time
const dayOfWeek = today.getDay();

app.get("/", (req, res) => {
    res.render(__dirname + "/views/index.ejs", { dayOfWeek: dayOfWeek});
})

// Start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
