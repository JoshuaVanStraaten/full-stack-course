import express from "express";
const app = express();
const port = 3000;

// Handle Endpoint requests
app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>");
})

app.get("/about", (req, res) => {
    res.send("<h1>About Me</h1><p>My name is Joshua</p>");
})

app.get("/contact", (req, res) => {
    res.send("<h1>Contact Me</h1>");
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
})
