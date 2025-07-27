import express from 'express';
import bodyParser from 'body-parser';

// Server setup
const app = express();
const port = 3000;

// In-app Database
var blogPosts = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

// Routes

// Home (View all Blog Posts)
app.get("/", (req, res) => {
    res.render("index.ejs", {blogPosts: blogPosts});
});

// Create a new Blog Post
app.get("/create", (req, res) => {
    res.render("create.ejs");
});

// Handle form submission for creating a new Blog Post
app.post("/create", (req, res) => {
    const {title, author, content} = req.body;

    // Create a timestamp for the post
    const timestamp = new Date().toLocaleString();

    // Update in-app DB
    blogPosts.push({title: title, author: author, content: content, date: timestamp});
    res.render("index.ejs", {blogPosts: blogPosts});
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
