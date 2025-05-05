const express = require('express')
const cookieParser = require("cookie-parser");

const authCheck = require('./authCheck')
const authentification = require('./user/authentification');
const userActions = require('./user/userActions');

const app = express();
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.post('/signup', authentification.signUp)
app.post('/login', authentification.logIn)

app.get('/', authCheck.verifyToken, async (req, res)=> {
  res.send("Access granted")
})

app.get('/user/:id', userActions.getUser)
app.put('/update-user/:id', userActions.updateUser)
app.delete('/delete-user/:id', userActions.deleteUser)

app.listen(port, () => {
    console.log("serveur sur le port ", port);
  })