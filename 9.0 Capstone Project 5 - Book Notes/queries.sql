-- book --
CREATE TABLE book (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	author TEXT NOT NULL,
	isbn TEXT UNIQUE NOT NULL,
	image_url TEXT NOT NULL,
	CONSTRAINT uq_title_author UNIQUE (title, author)
);

-- review --
CREATE TABLE review (
	id SERIAL PRIMARY KEY,
	book_id INTEGER NOT NULL REFERENCES book(id) ON DELETE CASCADE,
	date_read DATE NOT NULL DEFAULT CURRENT_DATE,
	rating INTEGER NOT NULL,
	notes TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create --
INSERT INTO book (title, author, isbn, image_url)
VALUES ('Atomic Habits', 'James Clear', '9780735211292', 'https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg')

INSERT INTO review (book_id, date_read, rating, notes)
VALUES (2, '2024-01-16', 8, 'Atomic Habits provides a practical and actionable framework for building good habits and breaking bad ones. It emphasizes that significant life changes are the result of tiny, consistent improvements rather than large, sudden transformations.')

-- view --
SELECT title, author, image_url, date_read, rating, notes
FROM book
JOIN review
ON book.id = review.book_id

-- update --
UPDATE review
SET date_read = '2023-01-16'
WHERE book_id = 1
RETURNING *;

UPDATE book
SET title = $1,
    author = $2,
    isbn = $3,
    image_url = $4
WHERE id = $5;

UPDATE review
SET rating = $6,
    date_read = $7,
    notes = $8,
    updated_at = CURRENT_TIMESTAMP
WHERE book_id = $5;

-- delete --
DELETE FROM book
WHERE id = 1;  -- CASCADE DELETES from review --