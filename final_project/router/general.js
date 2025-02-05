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
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    let isbn = req.params.isbn
    let bookisbn = books[isbn]

    if (bookisbn) {
        return res.status(200).json(bookisbn)
    } 

  return res.status(300).json({message: `"no book found with ISBN ${isbn}"`});
 });
  


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    let author = req.params.author
    let authorbooks = []
    for (let key in books) {
        if(author === books[key].author){
            authorbooks.push(books[key])
        }
    }

    if(authorbooks.length > 0){
        return res.status(200).json(authorbooks)
    }

  return res.status(401).json({message: "No author Found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    let title = req.params.title
    let titled_books = [];

    for(keys in books){
        if(books[keys].title === title ){
            titled_books.push(books[keys])
        }
    }

    if(titled_books.length > 0 ){
        return res.status(200).json(titled_books);      
    }

  return res.status(400).json({message: "No Books Found"});
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
