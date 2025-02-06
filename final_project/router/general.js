const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(300).json({
      message: "Provide an username and a password",
    });
  }

  if (!isValid(username)) {
    return res.status(300).json({ message: "Username already exists" });
  }

  users.push({ username, password });

  return res.status(300).json({
    message: `User ${username} registered successfully`,
  });
});

// Get the book list available in the shop
public_users.get("/", function(req, res) {
  const bookPromise = new Promise((resolve, reject) => {
    resolve(books);
  });
  bookPromise.then((books) => {
    const booksResponse = JSON.stringify(books, null, 4);
    return res.status(300).json(booksResponse);
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function(req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookPromise = new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });
  bookPromise.then((book) => {
    return res.status(300).json(book);
  });
});

// Get book details based on author
public_users.get("/author/:author", function(req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);
  const resBooksPromise = new Promise((resolve, reject) => {
    let resBooks = {};
    keys.forEach((key) => {
      if (books[key].author === author) {
        resBooks[key] = books[key];
      }
    });
    resolve(resBooks);
  });
  resBooksPromise.then((resBooks) => {
    return res.status(300).json(resBooks);
  });
});

// Get all books based on title
public_users.get("/title/:title", function(req, res) {
  //Write your code here
  const title = req.params.title;
  const keys = Object.keys(books);
  const resBooksPromise = new Promise((resolve, reject) => {
    let resBooks = {};
    keys.forEach((key) => {
      if (books[key].title === title) {
        resBooks[key] = books[key];
      }
    });
    resolve(resBooks);
  });
  resBooksPromise.then((resBooks) => {
    return res.status(300).json(resBooks);
  });
});

//  Get book review
public_users.get("/review/:isbn", function(req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.status(300).json({ review: book.reviews });
});

module.exports.general = public_users;
