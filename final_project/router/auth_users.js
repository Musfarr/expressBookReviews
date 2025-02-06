const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

    return users.some((user) => user.name === username )
   
}

const authenticatedUser = (username,password)=>{ //returns boolean

    let Validate = users.some((user) => user.name === username && user.password === password )

    if(Validate){
        return true
    }
    return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    let {username , password} = req.body

    if(isValid(username)){

        if(authenticatedUser(username ,password)){
            
            let user = {username :username }
            let accesstoken = jwt.sign(user , 'fingerprint_customer')
            req.session.authorization = accesstoken;

            return res.status(200).json({message: "User Logged In"});
        }

        return res.status(400).json({message: "Invalid Password"});
    }

    else{
        return res.status(404).json({message: "No User Found"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
    let isbn = req.params.isbn
    let review = req.query.review

    let user = req.session.user
    
  // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Check if user is logged in
    if (!user) {
        return res.status(400).json({ message: "User not logged in" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize the reviews object if it doesn't exist for this ISBN
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Check if the user has already reviewed this book
    if (books[isbn].reviews[user.username]) {
        // User has already reviewed the book, so we modify the review
        books[isbn].reviews[user.username] = review;
        return res.status(200).json({
            message: "Review updated successfully",
            review: books[isbn].reviews[user.username],
        });
    } else {
        // New review from the user, so we add it to the reviews
        books[isbn].reviews[user.username] = review;
        return res.status(200).json({
            message: "Review added successfully",
            review: books[isbn].reviews[user.username],
        });
}
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;          
    let user = req.session.user;         

    // Check if the user is logged in
    if (!user) {
        return res.status(400).json({ message: "User not logged in" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book has reviews
    if (!books[isbn].reviews || !books[isbn].reviews[user.username]) {
        return res.status(404).json({ message: "No review found for this user on the given book" });
    }

    // Delete the review by the logged-in user
    delete books[isbn].reviews[user.username];

    return res.status(200).json({ message: "Review deleted successfully" });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
