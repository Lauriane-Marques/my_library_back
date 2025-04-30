
const express = require('express');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

const jwtKey = process.env.JWT_KEY;

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) return res.status(401).json({ message: "Access Denied" });
  
    try {
      const verified = jwt.verify(token, jwtKey);
      req.user = verified;
      next();
    } catch (err) {
      console.error("Erreur de vérification du token:", err);
      res.status(400).json({ message: "Invalid Token" });
    }
  };

module.exports = {
    verifyToken
}