require('dotenv').config()
const express = require('express');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json())

const jwtKey = process.env.JWT_KEY;

const verifyToken = (req, res, next) => {
    // const token = req.cookies.token;
    console.log("key", jwtKey)
    const token = req.body //to test with postman
  
    if (!token) return res.status(401).json({ message: "Access Denied" });
  
    try {
      const verified = jwt.verify(token.token, jwtKey); //TODO: verify with cookies
      req.user = verified;
      next();
    } catch (err) {
      console.error("Error verifying the token:", err);
      res.status(400).json({ message: "Invalid Token" });
    }
  };

module.exports = {
    verifyToken
}