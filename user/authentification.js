const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require('../prisma')
const jwtKey = process.env.JWT_KEY;


const authentification = {
  signUp: async (req, res) => {
    try {
      const { username, pseudo, email, password } = req.body;
      
      if (!username || !pseudo || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      //TODO: add email verification (new function, testable)
      //TODO: add pseudo verification (no spaces)

      const existingUser = await prisma.users.findUnique({
        where: { email }
      });

      //TODO: add message for the front
      if (existingUser) {
        return res.status(409).json({ error: 'This email is already linked to an account' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.users.create({
        data: {
          username,
          pseudo,
          email,
          password: hashedPassword
        }
      });

      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json({
        message: 'User created successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error creating the account'});
    }
  },

  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userInfo = await await prisma.users.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!userInfo) {
        return res.status(401).json({ error: "Incorrect email or password" });
      }

      const passwordMatch = await bcrypt.compare(password, userInfo.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Incorrect email or password" });
      }
      const token = jwt.sign({ id: Number(userInfo.id) }, jwtKey, {
        expiresIn: "3 hours",
      });
      res.cookie("token", token, { httpOnly: true });
      res.status(201).json({
        message: 'Successfully logged in',
        token: token
      })
  } catch (error){
      console.error("Error logging in:", error);
      return res.status(500).json({ error: "Server error", details: error.message });
  }
  },

  logOut: async (req, res) => {
    try {
      res.clearCookie('token')
      return res.status(200).json({message :"Successfully logged out"});
    } catch (error){
      console.error("Error logging out:", error);
      return res.status(500).json({ error: "Server error", details: error.message });
  }
  }
}
  module.exports = authentification