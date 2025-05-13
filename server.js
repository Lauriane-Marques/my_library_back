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

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

console.log('CORS origins:', allowedOrigins);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// app.use(cors({
//   origin: config.frontendUrl,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origine bloquée par CORS:', origin, 'Origines autorisées:', allowedOrigins);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//Debugging purpose
app.use((req, res, next) => {
  console.log('Requête reçue:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    allowedOrigins
  });
  next();
});

app.post('/signup', authentification.signUp)
app.post('/login', authentification.logIn)

app.get('/', authCheck.verifyToken, async (req, res)=> {
  res.send("Access granted")
})

app.get('/user/:id', authCheck.verifyToken, userActions.getUser)
app.put('/update-user/:id', userActions.updateUser)
app.delete('/delete-user/:id', userActions.deleteUser)

app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An error occured on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const PORT = config.port;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
  });
}

module.exports = app;