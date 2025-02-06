const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

    let accesstoken = req.session.authorization ;

    if(accesstoken){
        let decoded = jwt.verify(accesstoken , 'fingerprint_customer')
        if(decoded){
            req.session.user = decoded;
            next();
        }
        else{
            res.status(400).send('Invalid Token')
        }
    }
    else{
        res.status(400).send('User not Logged in')
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
