if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
} else {
  require('dotenv').config({ path: '.env.production' });
}

const express = require('express')
const cookieParser = require("cookie-parser");
const cors = require("cors")

const config = require('./config')

const authCheck = require('./authCheck')
const authentification = require('./user/authentification');
const userActions = require('./user/userActions');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/signup', authentification.signUp)
app.post('/login', authentification.logIn)

app.get('/', authCheck.verifyToken, async (req, res)=> {
  res.send("Access granted")
})

app.get('/user/:id', authCheck.verifyToken, userActions.getUser)
app.put('/update-user/:id', userActions.updateUser)
app.delete('/delete-user/:id', userActions.deleteUser)

const PORT = config.port;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
  });
}

module.exports = app;