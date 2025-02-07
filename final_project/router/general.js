const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let {username , password} = req.body 

  if(!username || !password){
    return res.status(400).json({message: "Incomplete Creds"});
  }


  let UserExist = users.some((user) => user.name === username )

  if(UserExist){
    return res.status(409).json({message: "Username Already Exists"});
  }

  users.push({
    name : username,
    password: password
  })

  return res.status(200).json({message: "User Created "  ,
                                UserName : username,
                                });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    return new Promise((resolve , reject) =>{
    
        let success = true ;
        
        if(success){
             resolve(books)
        }
        else
        reject("Error Getting Books")
    })
    .then((books) => { 
        res.status(200).json(books)
    })
    .catch((err) => {
        res.status(400).send(err)
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    
    return new Promise((resolve , reject) => {

        let isbn = req.params.isbn
        let bookisbn = books[isbn]

        if (bookisbn) {
            resolve(bookisbn)
        } 

        else{
            reject(`"no book found with ISBN ${isbn}"`)
        }  
    })
    .then((books) => {
        res.status(200).json(books)
    } )
    .catch((err) => {
        res.status(400).send(err)
    })
 });
  


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    return new Promise((resolve, reject) => {
      let author = req.params.author;
      let authorbooks = [];
  
      for (let key in books) {
        if (author === books[key].author) {
          authorbooks.push(books[key]);
        }
      }

        if (authorbooks.length > 0) {
        resolve(authorbooks);
      } else {
        reject("No books found by the author.");
      }
    })
    .then((authorbooks) => {
      return res.status(200).json(authorbooks);
    })
    .catch((err) => {
      return res.status(401).json({ message: err });
    });
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    return new Promise((resolve, reject) => {
      let title = req.params.title;
      let titled_books = [];
  
      // Loop through the books to find those that match the given title
      for (let key in books) {
        if (books[key].title === title) {
          titled_books.push(books[key]);
        }
      }
  
      if (titled_books.length > 0) {
        resolve(titled_books);
      } else {
        reject("No books found with the given title.");
      }
    })
    .then((titled_books) => {
      return res.status(200).json(titled_books);
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  let isbn = req.params.isbn

  let book = books[isbn]
    
    if (book) {
        return res.status(200).json(book.reviews);
        
    } else {
        return res.status(400).json({message: "Yet to be implemented"});
    }
});

module.exports.general = public_users;
