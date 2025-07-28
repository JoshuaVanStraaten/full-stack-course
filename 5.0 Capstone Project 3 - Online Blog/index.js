import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

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

    // Generate a unique ID
    const id = uuidv4();

    // Update in-app DB
    blogPosts.push({id: id, title: title, author: author, content: content, date: timestamp});
    res.render("index.ejs", {blogPosts: blogPosts});
});

// Handle editing a post
app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    // Get post using UUID
    const post = blogPosts.find(p => p.id === id);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render("edit.ejs", { post });
});

app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const {title, author, content} = req.body;
    const index = blogPosts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).send("Post not found");
    }

    // Update blog within Array
    blogPosts[index] = {
        id: id,
        title: title,
        author: author,
        content: content,
        date: new Date().toLocaleString()
    };

    res.render("index.ejs", {blogPosts: blogPosts});
})

// Handle deleting a post
app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    // Filter out Post
    blogPosts = blogPosts.filter(p => p.id !== id);

    res.render("index.ejs", {blogPosts: blogPosts});
});

// Handle viewing a post (in full)
app.get("/view/:id", (req, res) => {
    const id = req.params.id;
    const index = blogPosts.findIndex(p => p.id === id);
    // Get Post
    const post = blogPosts[index];

    res.render("view_post.ejs", {post: post})
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
