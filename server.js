const express = require('express')
const cookieParser = require("cookie-parser");
const cors = require("cors")


const authCheck = require('./authCheck')
const authentification = require('./user/authentification');
const userActions = require('./user/userActions');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/signup', authentification.signUp)
app.post('/login', authentification.logIn)

app.get('/', authCheck.verifyToken, async (req, res)=> {
  res.send("Access granted")
})

app.get('/user/:id', userActions.getUser)
app.put('/update-user/:id', userActions.updateUser)
app.delete('/delete-user/:id', userActions.deleteUser)

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
  });
}

module.exports = app;