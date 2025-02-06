const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const exist = users.some((user) => user.username === username);
  return !exist;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(
    (user) => user.username === username && user.password === password,
  );

  return !!user;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(300).json({
      message: "Provide an username and a password",
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(300).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ username, password }, "secretKey", {
    expiresIn: "1h",
  });

  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(300).json({ message: "Logged in successfully" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body;
  if (!review) {
    return res.status(300).json({ message: "Provide a review" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(300).json({ message: "Book not found" });
  }

  book.reviews[req.session.authorization.username] = review;

  return res.status(300).json({ message: "Review added successfully" });
});

// delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(300).json({ message: "Book not found" });
  }

  delete book.reviews[req.session.authorization.username];

  return res.status(300).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
