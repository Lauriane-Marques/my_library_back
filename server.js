const express = require('express')
const cookieParser = require("cookie-parser");

const authCheck = require('./authCheck')
const authentification = require('./user/authentification')

const app = express();
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.post('/signup', authentification.signUp)

app.listen(port, () => {
    console.log("serveur sur le port ", port);
  })