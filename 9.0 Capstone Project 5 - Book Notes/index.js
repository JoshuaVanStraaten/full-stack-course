import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

// Set Up a new PG client
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "<YOUR_DB_NAME>",
    password: "<YOUR_DB_PASSWORD>",
    port: 5432,
});

// Connect to the DB
db.connect();

// Setup Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let reviews = [];

// READ all reviews
async function getReviews() {
    const result = await db.query(
        "SELECT title, author, isbn, image_url, book_id, date_read, rating, notes FROM book " +
        "JOIN review ON book.id = review.book_id");
    reviews = result.rows;
    return reviews;
}

async function getImage(isbn) {
    // Get image url and subtitle for book
    let subtitle = null;
    let image_url = null;
    try {
        const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN%3A${isbn}&format=json&jscmd=data`);
        const bookData = response.data[`ISBN:${isbn}`];
        subtitle = bookData.subtitle;
        image_url = bookData.cover.medium;
    } catch (error) {
        console.log(error.response.data);
        res.status(500);
    }

    return { subtitle, image_url };
}

let sortBy = "default";

// Handle routes

// Display all reviews
app.get("/", async (req, res) => {
    const reviews = await getReviews();
    res.render("index.ejs", {
        reviews: reviews,
        sortBy: sortBy
    });
});

app.get("/sort_by", async (req, res) => {
    sortBy = req.query.sort_by || "default"; // default sort

    var reviews = [];
    if (sortBy === "default") {
        reviews = await getReviews();
    } else {
        try {
            const result = await db.query(
                `SELECT title, author, isbn, image_url, book_id, date_read, rating, notes
                 FROM book
                 JOIN review ON book.id = review.book_id
                 ORDER BY ${sortBy} DESC`
            );
            reviews = result.rows;
            console.log(result.rows);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error - Unable to Sort reviews");
        }
    }

    res.render("index.ejs", { reviews: reviews, sortBy: sortBy });
});

// Create a new review
app.get("/create", async (req, res) => {
    res.render("create.ejs");
});

app.post("/create", async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const rating = req.body.rating;
    const isbn = req.body.isbn;
    const date_read = req.body.date_read;
    const notes = req.body.notes;
    const {subtitle, image_url} = await getImage(isbn);

    // Create a new review
    try {
        const result = await db.query(
        "INSERT INTO book (title, author, isbn, image_url, subtitle) " +
        "VALUES ($1, $2, $3, $4, $5) RETURNING id", [title, author, isbn, image_url, subtitle]);
        const book_id = result.rows[0].id;

        await db.query(
            "INSERT INTO review (book_id, date_read, rating, notes) " +
            "VALUES ($1, $2, $3, $4)", [book_id, date_read, rating, notes]
        );

        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.status(500).send("Server side error - Unable to create review");
    }
});

// Edit a review
app.get("/edit/:book_id", async (req, res) => {
    const book_id = req.params.book_id;
    // Select review with book_id
    try {
        const result = await db.query(
            "SELECT title, author, isbn, image_url, book_id, date_read, rating, notes FROM book " +
            "JOIN review ON book.id = review.book_id WHERE book.id = $1", [book_id]);
        const review = result.rows[0];
        res.render("edit.ejs", { review: review });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server side error");
    }
});

app.post("/edit/:book_id", async (req, res) => {
    const book_id = req.params.book_id;
    const title = req.body.title;
    const author = req.body.author;
    const rating = req.body.rating;
    const isbn = req.body.isbn;
    const date_read = req.body.date_read;
    const notes = req.body.notes;
    const {subtitle, image_url} = await getImage(isbn);

    // Update a review
    try {
        const result = await db.query(
        "UPDATE book SET title=$1, author=$2, isbn=$3, image_url=$4, subtitle=$5 " +
        "WHERE id=$6", [title, author, isbn, image_url, subtitle, book_id]);

        await db.query(
            "UPDATE review SET rating=$1, date_read=$2, notes=$3, updated_at=CURRENT_TIMESTAMP " +
            "WHERE book_id=$4", [rating, date_read, notes, book_id]
        );

        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.status(500).send("Server side error - Unable to update review");
    }
});

// Delete a review
app.post("/delete/:book_id", async (req, res) => {
    const book_id = req.params.book_id;

    try {
        const result = await db.query(
        "DELETE FROM book WHERE id=$1 RETURNING *", [book_id]);
        const deleted_rev = result.rows[0];

        console.log(deleted_rev);

        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.status(500).send("Server side error - Unable to delete request");
    }
});

// View a review (in full)
app.get("/view/:book_id", async (req, res) => {
    const book_id = req.params.book_id;

    // Select review with book_id
    try {
        const result = await db.query(
            "SELECT title, author, isbn, image_url, subtitle, book_id, date_read, rating, notes FROM book " +
            "JOIN review ON book.id = review.book_id WHERE book.id = $1", [book_id]);
        const review = result.rows[0];
        res.render("view_review.ejs", { review: review });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server side error - Unable to fetch review");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:3000`);
});